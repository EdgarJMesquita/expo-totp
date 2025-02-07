package expo.modules.totp

import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.types.Enumerable

enum class HmacAlgorithm(val value: String) : Enumerable {
    HmacSHA512("SHA512"),
    HmacSHA384("SHA384"),
    HmacSHA256("SHA256"),
    HmacSHA1("SHA1"),
    HmacMD5("MD5"),
}

internal class TotpOptions:Record {
    @Field
    var interval: Int = 30

    @Field
    var digits: Int = 6

    @Field
    var algorithm: HmacAlgorithm = HmacAlgorithm.HmacSHA512
}