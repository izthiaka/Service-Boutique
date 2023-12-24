export default class ShopStatus {
    static getPendingStatusLibelle() {
        return "PENDING"
    }

    static getActivatedStatusLibelle() {
        return "ACTIVE"
    }

    static getDesactivatedStatusLibelle() {
        return "DESACTIVATED"
    }

    static getBlockedStatusLibelle() {
        return "BLOCKED"
    }

    static validation = [
        ShopStatus.getPendingStatusLibelle(),
        ShopStatus.getActivatedStatusLibelle(),
        ShopStatus.getDesactivatedStatusLibelle(),
        ShopStatus.getBlockedStatusLibelle(),
    ]
}
