
let users = []
const SocketServer = (socket) => {

    //User who logs in
    socket.on("joinUser", (id) => {
        users.push({ id, socketId: socket.id })
       // console.log(users)
    })
    socket.on("disconnect", () => {
        users = users.filter(user => user.socketId !== socket.id)
        //console.log(users)
    })

    //Like post
    socket.on("likePost", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likePostToClient', payload)
            })
        }
    })

    //Add Comment
    socket.on("addComment", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('addCommentToClient', payload)
            })
        }
    })
    //Reply Comment
    socket.on("replyComment", (payload) => {
        console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('replyCommentToClient', payload)
            })
        }
    })
}

module.exports = SocketServer