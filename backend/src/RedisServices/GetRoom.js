async function getRoom(roomId,type) {
  const json = await redisClient.get(`Room-${type}-${roomId}`);
  return json ? JSON.parse(json) : null;
}

module.exports={getRoom}