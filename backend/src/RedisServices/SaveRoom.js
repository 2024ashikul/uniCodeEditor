async function saveRoom(roomId, data ,type) {
  await redisClient.set(`Room-${type}-${roomId}`, JSON.stringify(data));
}
module.exports={saveRoom}