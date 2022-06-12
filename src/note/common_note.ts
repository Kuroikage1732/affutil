import { cloneDeep } from 'lodash-es';

/**
 * 自动对齐时间点
 * @param time 待偏移的时间点
 * @param bpm 基准bpm
 * @param error 允许的误差
 * @param lcm 需要对齐的细分的最小公倍数
 * @returns 时间对齐后的时间点
 */
export function timeAlign(time: number, bpm: number, error = 3, lcm = 96): number {
    const fpb = 60000 * 4 / bpm / lcm;
    let alignedTime = 0;
    const atime1 = Math.round(Math.floor(time / fpb) * fpb); // 向下取grid时间戳
    const atime2 = Math.round(Math.ceil(time / fpb) * fpb); // 向上取grid时间戳
    const abs1 = Math.abs(time - atime1); // atime1与time的距离
    const abs2 = Math.abs(time - atime2);
    let ok1 = (abs1 <= error); //abs1是否在容差内
    const ok2 = (abs2 <= error);
    if(ok1 && ok2 && abs1 > abs2) {
        ok1 = false; // 哪个距离小就用哪个
    }
    if(ok1) {
        alignedTime = atime1;
    } else if(ok2) {
        alignedTime = atime2;
    } else {
        alignedTime = time;
    }
    return Math.floor(alignedTime);
}

export class Note {
    time: number;

    /**
     * @param time Note时间点
     */
    constructor(time: number) {
        this.time = Math.floor(time);
    }

    /**
     * 获取类名
     */
    get type() {
        return this.constructor.name;
    }

    /**
     * 将对象转换为字符串
     * @returns Note的Note语句形式字符串
     */
    toString() {
        return ';';
    }

    /**
     * 将Note移动到某个时间点
     * @param dest 偏移到的时间点
     * @returns 偏移后的Note对象
     */
    moveto(dest: number): Note {
        this.time = Math.floor(dest);
        return this;
    }

    /**
     * @returns 返回Note对象的深拷贝
     */
    clone(): Note {
        return cloneDeep(this);
    }

    /**
     * 将Note镜像(注：此方法会修改对象)
     * @returns 镜像后的Note
     */
    mirror(): Note {
        return this;
    }

    /**
     * 偏移Note指定的毫秒数
     * @param value 偏移的毫秒数
     * @returns 偏移后的Note对象
     */
    offsetto(value: number): Note {
        this.time = Math.floor(this.time + value);
        return this;
    }

    /**
     * 将Note时间对齐
     * @param bpm 基准bpm
     * @param error 允许的误差
     * @param lcm 需要对齐的细分的最小公倍数
     * @returns 时间对齐的Note对象
     */
    align(bpm: number, error = 3, lcm = 96): Note {
        this.time = timeAlign(this.time, bpm, error, lcm);
        return this;
    }
}

export class NoteGroup extends Array<Note|NoteGroup> {
    /**
     * @param notes Note容器
     */
    constructor(notes:  Note[] | NoteGroup = []) {
        super();
        if(notes) {
            notes.forEach((value) => {
                if(value instanceof Array && value.type != 'TimingGroup') {
                    this.concat(value);
                } else {
                    this.push(value);
                }
            });
        }
    }

    /**
     * 获取类名
     */
    get type() {
        return this.constructor.name;
    }

    /**
     * Note容器内所有Note的Note语句形式字符串
     * @returns 转换后的字符串
     */
    toString(): string {
        let str = '';
        this.forEach((value: Note | NoteGroup, index) => {
            if(value) {
                str += value.toString();
            }
            if(index < this.length - 1) {
                str += '\n';
            }
        });
        return str;
    }

    /**
     * 向容器中追加Note对象或Note容器对象
     * @param objs 接收Note或Note容器对象
     * @returns 追加后的Note容器长度
     */
    push(...objs: Array<Note | NoteGroup>) {
        objs.forEach((obj) => {
            super.push(obj);
        });
        return this.length;
    }

    /**
     * 连接多个Note容器对象(注：此方法会改变 NoteGroup 内容)
     * @param iterables 待连接的Note容器对象
     * @returns 连接后的Note容器
     */
    concat(...iterables: Array<Note[] | NoteGroup>) {
        iterables.forEach((iter) => {
            iter.forEach((item) => {
                this.push(item);
            });
        });
        return this;
    }

    /**
     * 将Note容器整体偏移到一个时间点
     * @param dest 偏移到的时间点
     * @returns 偏移后的Note容器
     */
    moveto(dest: number) {
        this.forEach((value, index) => {
            if(value) {
                this[index].moveto(dest);
            }
        });
        return this;
    }

    /**
     * 将Note容器整体偏移一个毫秒数
     * @param value 偏移到的时间点
     * @returns 偏移后的Note容器
     */
    offsetto(value: number): NoteGroup {
        this.forEach((v, index) => {
            if(v) {
                this[index].offsetto(value);
            }
        });
        return this;
    }

    /**
     * 将Note容器内部所有Note镜像
     * @returns 镜像后的Note容器
     */
    mirror() {
        this.forEach((value, index) => {
            if(value) {
                this[index].mirror();
            }
        });
        return this;
    }

    /**
     * 将Note容器内部所有Note对象时间对齐
     * @param bpm 基准bpm
     * @param error 允许的误差
     * @param lcm 需要对齐的细分的最小公倍数
     * @returns 时间对齐的Note容器
     */
    align(bpm: number, error = 3, lcm = 96) {
        this.forEach((value, index) => {
            if(value) {
                this[index].align(bpm, error, lcm);
            }
        });
        return this;
    }
}