
const generateInviteCode = (table, phone) => {
    let lastdigit = phone.slice(-3)
    return `AduraTemi/${table}/${lastdigit}`
}

module.exports = {
    generateInviteCode
}