// Miner - stationary harvester for container mining. Fills containers and sits in place.

import {taskDeposit} from '../tasks/task_deposit';
import {taskHarvest} from '../tasks/task_harvest';
import {AbstractCreep, AbstractSetup} from './Abstract';
import {MiningSite} from '../baseComponents/MiningSite';
import {taskGoToRoom} from '../tasks/task_goToRoom';

export class MinerSetup extends AbstractSetup {
	constructor() {
		super('miner');
		// Role-specific settings
		this.settings.bodyPattern = [WORK, WORK, CARRY, MOVE];
		this.settings.allowBuild = true;
		this.roleRequirements = (creep: Creep) => creep.getActiveBodyparts(WORK) > 1 &&
												  creep.getActiveBodyparts(MOVE) > 1 &&
												  creep.getActiveBodyparts(CARRY) > 1;
	}
}

export class MinerCreep extends AbstractCreep {
	assignment: Source;
	miningSite: MiningSite;

	constructor(creep: Creep) {
		super(creep);
	}

	init() {
		if (!this.assignment) {
			return;
		}
		this.miningSite = this.colony.miningSites[this.assignment.ref];
	}

	newTask() {
		// Ensure you are in the assigned room
		if (this.inAssignedRoom) {
			// Are you out of energy?
			if (this.carry.energy == 0) {
				this.task = new taskHarvest(this.assignment);
			} else if (this.miningSite && this.miningSite.output) { // output construction sites handled by miningSite
				this.task = new taskDeposit(this.miningSite.output);
			}
		} else {
			this.task = new taskGoToRoom(this.assignedRoomFlag);
		}
	}

	onRun() {
		if (this.getActiveBodyparts(WORK) < 0.75 * this.getBodyparts(WORK)) {
			this.suicide(); // kill off miners that might have gotten damaged so they don't sit and try to mine
		}
		if (this.colony.incubating) {
			if (this.carry.energy == 0) { // request renewal after a mining cycle is finished
				this.renewIfNeeded();
			}
		}
	}
}

