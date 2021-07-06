// Modifications to Game-level functions

const _marketDeal = Game.market.deal;
Game.market.deal = function(orderId: string, amount: number, targetRoomName?: string): ScreepsReturnCode {
	const response = _marketDeal(orderId, amount, targetRoomName);
	if (response == OK) {
		if (targetRoomName && Game.rooms[targetRoomName] && Game.rooms[targetRoomName].terminal
			&& Game.rooms[targetRoomName].terminal!.my) {
			// Mark the terminal as being blocked
			(<any>Game.rooms[targetRoomName].terminal!)._notReady = true;
		}
	}
	return response;
};

// Replaces deprecated function with same functionality to remove warnings and ensure funcationality
Game.map.isRoomReachable = function(roomName: string): boolean {
	const response = Game.map.getRoomStatus(roomName).status;
	if (response == "closed") {
		return false;
	}
	const spawn = Game.spawns[1];
	const spawnRoomStatus = Game.map.getRoomStatus(spawn.room.name).status;
	if ((response != spawnRoomStatus) && ((roomName.charAt(1) != '0') || (roomName.charAt(2) != '0') || (roomName.charAt(4) != '0') || (roomName.charAt(5) != '0'))) {
		return false;
	}
	return true;
}
