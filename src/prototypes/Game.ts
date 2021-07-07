// Modifications to Game-level functions

import { Cartographer, ROOMTYPE_ALLEY, ROOMTYPE_CROSSROAD } from "utilities/Cartographer";

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
Game.map.isRoomAvailable = function(roomName: string): boolean {
	const response = Game.map.getRoomStatus(roomName).status;
	if (response == "closed") {
		return false;
	}
	const spawn = Game.spawns[0];
	const spawnRoomStatus = Game.map.getRoomStatus(spawn.room.name).status;
	const roomType = Cartographer.roomType(roomName);
	if (response != spawnRoomStatus && roomType != ROOMTYPE_ALLEY && roomType!=ROOMTYPE_CROSSROAD) {
		return false;
	}
	return true;
}
