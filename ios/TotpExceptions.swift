//
//  TotpExceptions.swift
//  ExpoTotp
//
//  Created by Edgar Jonas Mesquita da Silva on 08/02/25.
//

import ExpoModulesCore


extension Exceptions {
    
    internal final class InvalidSecretKey: Exception {
        override var reason: String {
          "Invalid secret key."
        }
    }
    
}
