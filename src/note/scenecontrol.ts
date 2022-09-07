import { Note } from './common_note';

export class SceneControl extends Note {
    scenetype: string;
    cmd: string[];

    constructor(time: number, scenetype: string, cmd: string[] = []) {
        super(time);
        this.scenetype = scenetype;
        this.cmd = cmd;
    }

    toString() {
        if (this.cmd.length == 0)
            return `scenecontrol(${Math.floor(this.time)},${this.scenetype});`;
        return `scenecontrol(${Math.floor(this.time)},${this.scenetype},${this.cmd.join(',')});`;
    }
}