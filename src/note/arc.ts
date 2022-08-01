import { Hold } from './hold';
import { cloneDeep } from 'lodash-es';
import { fxlist, slideeasinglist } from './validstrings';
import { timeAlign } from './common_note';
import { EasingFunc, slicer } from '../easing/index';

export class Arc extends Hold {
    fromx: number;
    fromy: number;
    tox: number;
    toy: number;
    _slideeasing!: string | EasingFunc | [EasingFunc, EasingFunc];
    _color!: number;
    isskyline: boolean;
    _skynote!: number[];
    _fx!: string;

    /**
     * @param time Note时间点
     * @param totime Note结束时间点
     * @param fromx 起始点x坐标
     * @param tox 起始点x坐标
     * @param slideeasing 缓动类型，支持s|b|si|so两两组合/缓动函数/两个缓动函数组成的列表
     * @param fromy 终点y坐标
     * @param toy 终点y坐标
     * @param color Arc颜色，要求>=0
     * @param isskyline 是否为黑线
     * @param skynote 天键时间点列表
     * @param fx FX
     */
    constructor(
        time: number,
        totime: number,
        fromx: number,
        tox: number,
        slideeasing: string,
        fromy: number,
        toy: number,
        color: number,
        isskyline: boolean,
        skynote: number[] = [],
        fx = 'none'
    ) {
        super(time, totime, 1);
        this.fromx = fromx;
        this.fromy = fromy;
        this.tox = tox;
        this.toy = toy;
        this.slideeasing = slideeasing;
        this.color = color;
        this.isskyline = isskyline;
        this.skynote = skynote;
        this.fx = fx;
    }

    set skynote(times) {
        if (times) {
            this._skynote = cloneDeep(times);
            this._skynote.sort();
        }
    }
    get skynote() {
        return this._skynote;
    }

    set color(value) {
        if (value >= 0) {
            this._color = value;
        } else {
            throw `invalid value ${value} for attribute "color" (only accept >=0)`;
        }
    }
    get color() {
        return this._color;
    }

    set slideeasing(easingtype) {
        if(easingtype instanceof Array) {
            const valid = ['b', 's', 'si', 'so'];
            for (let i = 0; i < 2; i++) {
                if(easingtype[i] instanceof Function) {
                    break;
                } else {
                    const et: any = easingtype[i];
                    if(valid.indexOf(et) == -1) {
                        throw `invalid value ${easingtype[i]} for attribute "slideeasing" (only accept ${valid})`;
                    }
                }
            }
        } else if(!(easingtype instanceof Function)) {
            if (slideeasinglist.indexOf(easingtype) == -1) {
                throw `invalid value ${easingtype} for attribute "slideeasing" (only accept ${slideeasinglist})`;
            }
        }
        this._slideeasing = easingtype;
    }
    get slideeasing() {
        return this._slideeasing;
    }

    __geteasingtype(): [string, string] | [EasingFunc, EasingFunc] {
        const se = this.slideeasing;
        let x_type: any;
        let y_type: any;
        if(se instanceof Function) {
            x_type = se;
            y_type = se;
        } else if(se instanceof Array) {
            x_type = se[0];
            y_type = se[1];
        } else {
            x_type = 's';
            y_type = 's';
            
            if(se.length < 3 && ['bb', 'bs', 'sb', 'ss'].indexOf(se) == -1) {
                x_type = se;
                if(se == 'b') {
                    y_type = 'b';
                }
            } else {
                if(se.startsWith('b')) {
                    x_type = 'b';
                } else if(se.startsWith('si')) {
                    x_type = 'si';
                } else if(se.startsWith('so')) {
                    x_type = 'so';
                }

                if(se.endsWith('b')) {
                    y_type = 'b';
                } else if(se.endsWith('si')) {
                    y_type = 'si';
                } else if(se.endsWith('so')) {
                    y_type = 'so';
                }
            }
        }
        return [x_type, y_type];
    }

    /**
     * 获取对应时间点的Arc坐标
     * @param time 时间点
     * @returns 坐标
     */
    get(time: number): [number, number] {
        const easingtype = this.__geteasingtype();
        const slice_x = slicer(time, this.time, this.totime, this.fromx, this.tox, easingtype[0]);
        const slice_y = slicer(time, this.time, this.totime, this.fromy, this.toy, easingtype[1]);
        return [slice_x, slice_y];
    }

    /**
     * 将对象转换为字符串(注：只有slideeasing值为note.validstrings.slideeasinglist中的规定值时才允许返回)
     * @returns 转换后的字符串
     */
    toString() {
        const arcstr = `arc(${this.time},${this.totime},${this.fromx.toFixed(2)},${this.tox.toFixed(2)},${this._slideeasing},${this.fromy.toFixed(2)},${this.toy.toFixed(2)},${this._color},${this._fx},${this.isskyline})`;
        let skynotestr = '';
        if (this._skynote.length > 0) {
            for (let index = 0; index < this._skynote.length; index++) {
                const time = this._skynote[index];
                skynotestr += `arctap(${time})`;
                if (index != this._skynote.length - 1) {
                    skynotestr += ',';
                }
            }
        }
        return arcstr + ((skynotestr == '') ? '' : `[${skynotestr}]`) + ';';
    }

    /**
     * 将Note移动到某个时间点
     * @param dest 偏移到的时间点
     * @returns 偏移后的Note对象
     */
    moveto(dest: number) {
        const offset = dest - this.time;
        for (let index = 0; index < this._skynote.length; index++) {
            this._skynote[index] += offset;
        }
        return this;
    }

    /**
     * 将Note镜像(注：此方法会修改对象)
     * @returns 镜像后的Note
     */
    mirror() {
        this.fromx = 1 - this.fromx;
        this.tox = 1 - this.tox;
        return this;
    }

    /**
     * 将Note垂直镜像(注：此方法会修改对象)
     * @returns 镜像后的Note
     */
    vmirror() {
        this.fromy = 1 - this.fromy;
        this.toy = 1 - this.toy;
        return this;
    }

    /**
     * 偏移Note指定的毫秒数
     * @param value 偏移的毫秒数
     * @returns 偏移后的Note对象
     */
    offsetto(value: number) {
        super.offsetto(value);
        if (this._skynote) {
            this._skynote.forEach((v, index) => {
                this._skynote[index] += value;
            });
        }
        return this;
    }

    /**
     * 将Note时间对齐
     * @param bpm 基准bpm
     * @param error 允许的误差
     * @param lcm 需要对齐的细分的最小公倍数
     * @returns 时间对齐的Note对象
     */
    align(bpm: number, error = 3, lcm = 96) {
        super.align(bpm, error, lcm);
        if (this._skynote) {
            this._skynote.forEach((value, index) => {
                this._skynote[index] = timeAlign(value, bpm, error, lcm);
            });
        }
        return this;
    }

    /**
     * 偏移Arc指定大小
     * @param xValue x轴偏移量
     * @param yValue y轴偏移量
     * @returns 偏移后的Note对象
     */
    transfer(xValue: number, yValue: number) {
        this.fromx += xValue;
        this.tox += xValue;
        this.fromy += yValue;
        this.toy += yValue;
        return this;
    }
}
