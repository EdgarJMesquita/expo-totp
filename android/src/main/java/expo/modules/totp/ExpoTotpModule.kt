package expo.modules.totp

import android.os.Bundle
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Timer
import java.util.TimerTask
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import android.util.Base64
import kotlin.math.pow

const val CHANGE_EVENT_NAME = "onTotpUpdate"

class ExpoTotpModule : Module() {

  private var timer: Timer? = null

  override fun definition() = ModuleDefinition {

    Name("ExpoTotp")

    Events(CHANGE_EVENT_NAME)

    AsyncFunction("getTotp", this@ExpoTotpModule::getTotp)

    AsyncFunction("startUpdates", this@ExpoTotpModule::startUpdates)

    AsyncFunction("stopUpdates", this@ExpoTotpModule::stopUpdates)

    AsyncFunction("start", this@ExpoTotpModule::startUpdates)

    AsyncFunction("stop", this@ExpoTotpModule::stopUpdates)

  }

  private fun getTotp(secretKey: String, options: TotpOptions?): Bundle {
    val secretBase64 = Base64.encodeToString(secretKey.toByteArray(), Base64.DEFAULT)
    val finalOptions = options ?: TotpOptions()

    return this@ExpoTotpModule.computeTotp(secretBase64, finalOptions)
  }

  private fun startUpdates(secretKey: String, options: TotpOptions?){
    stopUpdates()

    timer = Timer()

    val secretBase64 = Base64.encodeToString(secretKey.toByteArray(), Base64.DEFAULT)

    val finalOptions = options ?: TotpOptions()

    timer?.schedule(object : TimerTask() {
      override fun run() {
        val totpInfo = this@ExpoTotpModule.computeTotp(secretBase64, finalOptions)
        sendEvent(CHANGE_EVENT_NAME, totpInfo)
      }
    },0,1000)
  }

  private fun stopUpdates(){
    timer?.cancel()
    timer = null
  }

  private fun computeTotp(secretBase64: String, options: TotpOptions): Bundle {
    val currentTime = (System.currentTimeMillis() / 1000).toInt()
    val remainingTime = options.interval - (currentTime % options.interval)
    val currentInterval = currentTime / options.interval

    val keyBytes = Base64.decode(secretBase64, Base64.DEFAULT)
    val message = ByteArray(8) { i -> (currentInterval.toLong() shr (56 - i * 8)).toByte() }

    val mac = Mac.getInstance(options.algorithm.toString())
    mac.init(SecretKeySpec(keyBytes, options.algorithm.toString()))
    val hash = mac.doFinal(message)

    val offset = hash[hash.size - 1].toInt() and 0x0F
    val truncatedHash = hash.copyOfRange(offset, offset + 4)

    val binary = (truncatedHash[0].toInt() and 0x7F shl 24) or
            ((truncatedHash[1].toInt() and 0xFF) shl 16) or
            ((truncatedHash[2].toInt() and 0xFF) shl 8) or
            (truncatedHash[3].toInt() and 0xFF)

    val otpMod = 10.0.pow(options.digits).toInt()

    val otp = (binary % otpMod).toString().padStart(options.digits, '0')

    return bundleOf(
      "code" to otp,
      "remainingTime" to remainingTime,
      "progress" to remainingTime.toDouble() / options.interval * 100,
    )
  }

}
