export type EasingFunc = ((percent: number) => number);

export function linear(percent: number) {
    return percent;
}

export function sine(percent: number) {
    return Math.sin(percent * (Math.PI / 2));
}

export function cosine(percent: number) {
    return Math.cos((percent * (Math.PI / 2)) + Math.PI) + 1;
}

// 参照了Webkit的贝塞尔缓动实现
// https://trac.webkit.org/browser/trunk/Source/WebCore/platform/graphics/UnitBezier.h
export function bezier(percent: number, p1x: number = 1 / 3, p1y = 0, p2x: number = 2 / 3, p2y = 1) {
    const cx = 3.0 * p1x;
    const bx = 3.0 * (p2x - p1x) - cx;
    const ax = 1.0 - cx - bx;
    const cy = 3.0 * p1y;
    const by = 3.0 * (p2y - p1y) - cy;
    const ay = 1.0 - cy - by;

    function solve_curve_x(x: number): number {
        let t2 = x;
        for (let i = 0; i < 8; i++) {
            const x2 = ((ax * t2 + bx) * t2 + cx) * t2 - x;
            if (Math.abs(x2) < 1e-6) {
                return t2;
            }
            const d2 = (3.0 * ax * t2 + 2.0 * bx) * t2 + cx;
            if (Math.abs(d2) < 1e-6) {
                break;
            }
            t2 = t2 - x2 / d2;
        }

        let t0 = 0.0;
        let t1 = 1.0;
        t2 = x;

        if (t2 < t0) {
            return t0;
        }
        if (t2 > t1) {
            return t1;
        }

        while (t0 < t1) {
            const x2 = ((ax * t2 + bx) * t2 + cx) * t2;
            if (Math.abs(x2 - x) < 1e-6) {
                return t2;
            }
            if (x > x2) {
                t0 = t2;
            } else {
                t1 = t2;
            }
            t2 = (t1 - t0) * 0.5 + t0;
        }
        return t2;
    }

    const t = solve_curve_x(percent);
    return ((ay * t + by) * t + cy) * t;
}

export function get_ease(percent: number, type: string, b_point: number[] = [1 / 3, 0, 2 / 3, 1]) {
    if (type == 'si') {
        return sine(percent);
    } else if (type == 'so') {
        return cosine(percent);
    } else if (type == 'b') {
        return bezier(percent, b_point[0], b_point[1], b_point[2], b_point[3]);
    } else {
        return percent;
    }
}

export function get_easing_func(type: string, b_point: number[] = [1 / 3, 0, 2 / 3, 1]) {
    if (type == 'si') {
        return sine;
    } else if (type == 'so') {
        return cosine;
    } else if (type == 'b') {
        return make_bezier(b_point);
    } else {
        return linear;
    }
}

export function make_bezier(b_point: number[] = [1 / 3, 0, 2 / 3, 1]) {
    function custom_bezier(x: number) {
        return bezier(x, b_point[0], b_point[1], b_point[2], b_point[3]);
    }
    return custom_bezier;
}

export function slicer(time: number, fromtime: number, totime: number, fromposition: number, toposition: number, easingtype: string | EasingFunc = 's') {
    const t_offset = fromtime;
    const p_offset = fromposition;
    time -= t_offset;
    totime -= t_offset;
    toposition -= p_offset;

    if (easingtype instanceof Function) {
        return toposition * easingtype(time / totime) + p_offset;
    } else {
        if (easingtype == 'si') {
            return toposition * sine(time / totime) + p_offset;
        } else if (easingtype == 'so') {
            return toposition * cosine(time / totime) + p_offset;
        } else if (easingtype == 'b') {
            return toposition * bezier(time / totime) + p_offset;
        } else {
            return toposition * linear(time / totime) + p_offset;
        }
    }
}