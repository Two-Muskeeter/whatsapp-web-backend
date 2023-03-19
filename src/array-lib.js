export function remove(...forDeletion) {
    return this.filter(item => !forDeletion.includes(item))
}
