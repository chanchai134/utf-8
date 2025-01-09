const fs = require('fs')

fs.readFile(__filename, (_, data) => {
    let content = ""
    let leftBytes = 0
    let firstByte = true
    let temp = 0
    for (const byte of data) {
        if(firstByte) {
            if(temp) {
                content += String.fromCodePoint(temp)
                temp = 0
            }
            if(0x7f | byte === 0x7f) {
                temp = 0x7f & byte
            } else if(0xc0 & byte === 0xc0) {
                leftBytes = 1
                firstByte = false
                temp += (0x1f & byte) * 64 ** leftBytes
            } else if(0xe0 & byte === 0xe0) {
                leftBytes = 2
                firstByte = false
                temp += (0x0f & byte) * 64 ** leftBytes
            } else {
                leftBytes = 3
                firstByte = false
                temp += (0x07 & byte) * 64 ** leftBytes
            }
        } else {
            leftBytes--;
            temp += (0x3f & byte) * 64 ** leftBytes
            if(leftBytes === 0) firstByte = true
        }
    }
    console.log(content)
})
