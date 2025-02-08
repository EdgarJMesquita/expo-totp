import ExpoModulesCore
import CommonCrypto

fileprivate let CHANGE_EVENT_NAME = "onTotpUpdate"

public class ExpoTotpModule: Module {
    private var timer: Timer?
    
    public func definition() -> ModuleDefinition {
        Name("ExpoTotp")

        Events(CHANGE_EVENT_NAME)
      
        AsyncFunction("getTotp", getTotp)
        
        AsyncFunction("startUpdates", startUpdates)
        
        AsyncFunction("stopUpdates", stopUpdates)

        AsyncFunction("start", startUpdates)
        
        AsyncFunction("stop", stopUpdates)
        
    }
    
    private func getTotp(secretKey: String, options: TotpOptions?) -> [String: Any]? {
        let secretBase64 = Data(secretKey.utf8).base64EncodedString()
        let finalOptions = options ?? TotpOptions()
        
        return computeTotp(secretBase64: secretBase64, options: finalOptions)
    }
    
    private func startUpdates(secretKey: String, options: TotpOptions?){
        stopUpdates()
        
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
    
    private func stopUpdates(){
        timer?.invalidate()
        timer = nil
    }
    
    private func computeTotp(secretBase64: String, options: TotpOptions) -> [String: Any]? {
        let currentTime = Int(Date().timeIntervalSince1970)
        let remainingTime = options.interval - currentTime % options.interval
        let currentInterval = currentTime / options.interval
        
        guard let keyData = Data(base64Encoded: secretBase64) else {
          NSLog("Invalid secret provided")
          return nil
        }
        
        // Create message for HMAC
        var counter = UInt64(currentInterval).bigEndian
        let counterData = withUnsafeBytes(of: &counter) { Data($0) }

        // Generate HMAC-SHA512 hash
        var hash = [UInt8](repeating: 0, count: Int(options.algorithm.getLength()))
        keyData.withUnsafeBytes { keyBytes in
          counterData.withUnsafeBytes { counterBytes in
              CCHmac(CCHmacAlgorithm(options.algorithm.getAlgorithm()), keyBytes.baseAddress, keyData.count, counterBytes.baseAddress, counterData.count, &hash)
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
          "progress": (Double(remainingTime) / Double(options.interval)) * 100
        ]
    }
}
