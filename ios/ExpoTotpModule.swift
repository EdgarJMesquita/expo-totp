import ExpoModulesCore
import CommonCrypto

fileprivate let CHANGE_EVENT_NAME = "onChange"

public class ExpoTotpModule: Module {
    private var timer: Timer?
    
    public func definition() -> ModuleDefinition {
        Name("ExpoTotp")

        Events(CHANGE_EVENT_NAME)
      
        AsyncFunction("start", start)

        AsyncFunction("stop", stop)
        
    }
    
    private func start(secretKey: String, options: TotpOptions?){
        stop()
        
        let secretBase64 = Data(secretKey.utf8).base64EncodedString()
        
        let finalOptions = options ?? TotpOptions()
        
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
                guard let self else { return }
                guard let totpInfo = computeTotp(secretBase64: secretBase64, options: finalOptions) else {
                    return
                }
                sendEvent(CHANGE_EVENT_NAME, totpInfo)
            }
        }
    }
    
    private func stop(){
        timer?.invalidate()
        timer = nil
    }
    
    private func computeTotp(secretBase64: String, options: TotpOptions) -> [String: Any]? {
        let currentTime = Int(Date().timeIntervalSince1970)
        let remainingTime = Double(options.interval) - Double(currentTime % Int(options.interval))
        let currentInterval = currentTime / Int(options.interval)
        
        guard let keyData = Data(base64Encoded: secretBase64) else {
          NSLog("Invalid secret provided")
          return nil
        }
        
        // Create message for HMAC
        var counter = UInt64(currentInterval).bigEndian
        let counterData = withUnsafeBytes(of: &counter) { Data($0) }

        // Generate HMAC-SHA512 hash
        var hash = [UInt8](repeating: 0, count: Int(options.algorithm.getLenght()))
        keyData.withUnsafeBytes { keyBytes in
          counterData.withUnsafeBytes { counterBytes in
              CCHmac(CCHmacAlgorithm(options.algorithm.getAlgorith()), keyBytes.baseAddress, keyData.count, counterBytes.baseAddress, counterData.count, &hash)
          }
        }

        // Extract offset and compute TOTP
        let offset = hash[hash.count - 1] & 0x0F
        let truncatedHash = (UInt32(hash[Int(offset)]) & 0x7F) << 24 |
                            (UInt32(hash[Int(offset) + 1]) & 0xFF) << 16 |
                            (UInt32(hash[Int(offset) + 2]) & 0xFF) << 8 |
                            (UInt32(hash[Int(offset) + 3]) & 0xFF)
        
        let otpMod = UInt32(pow(10.0, Double(options.digits)))
        let otp = truncatedHash % otpMod
        let otpString = String(format: "%0\(options.digits)d", otp)

        return [
          "code": otpString,
          "remainingTime": remainingTime,
          "progress": Double(remainingTime) / Double(options.interval) * 100
        ]
    }
}
