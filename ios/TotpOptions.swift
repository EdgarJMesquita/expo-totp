//
//  TotpOptions.swift
//  ExpoTotp
//
//  Created by Edgar Jonas Mesquita da Silva on 07/02/25.
//

import ExpoModulesCore
import CommonCrypto

enum HmacAlgorithm: String, Enumerable {
    
    case SHA512
    case SHA384
    case SHA256
    case SHA1
    case MD5
    
    func getAlgorithm() -> Int {
        switch self {
            case .SHA512:
                return kCCHmacAlgSHA512
            case .SHA384:
                return kCCHmacAlgSHA384
            case .SHA256:
                return kCCHmacAlgSHA256
            case .SHA1:
                return kCCHmacAlgSHA1
            case .MD5:
                return kCCHmacAlgMD5
        }
    }
    
    
    func getLength() -> Int32 {
        switch self {
            case .SHA512:
                return CC_SHA512_DIGEST_LENGTH
            case .SHA384:
                return CC_SHA384_DIGEST_LENGTH
            case .SHA256:
                return CC_SHA256_DIGEST_LENGTH
            case .SHA1:
                return CC_SHA1_DIGEST_LENGTH
            case .MD5:
                return CC_MD5_DIGEST_LENGTH
        }
    }
    
}

struct TotpOptions: Record {
    @Field
    var interval: Int = 30
    
    @Field
    var digits: Int = 6
    
    @Field
    var algorithm: HmacAlgorithm = .SHA512

}
