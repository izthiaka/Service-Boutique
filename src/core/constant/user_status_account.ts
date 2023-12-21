export default class UserStatusAccount {
    static getPendingStatusLibelle() {
        return "PENDING"
    }

    static getActivatedStatusLibelle() {
        return "ACTIVE"
    }

    static getDesactivatedStatusLibelle() {
        return "DESACTIVATED"
    }

    static getBannedStatusLibelle() {
        return "BANNED"
    }

    static validation = [
        UserStatusAccount.getPendingStatusLibelle(),
        UserStatusAccount.getActivatedStatusLibelle(),
        UserStatusAccount.getDesactivatedStatusLibelle(),
        UserStatusAccount.getBannedStatusLibelle(),
    ]
}
