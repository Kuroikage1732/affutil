/**
 * 缓动类型中合法的字符串
 */
const slideeasinglist: string[] = [
    'b',
    's',
    'si',
    'so',
    'sisi',
    'soso',
    'sosi',
    'siso'
];

/**
 * 拓展缓动类型中合法的字符串，可以用于计算但是不能输出
 */
const slideeasingexlist: string[] = [
    'bb',
    'sb',
    'sib',
    'sob',
    'bs',
    'ss',
    'sis',
    'sos',
    'bsi',
    'ssi',
    'bso',
    'sso',
];

/**
 * Arc的fx属性中合法的字符串
 */
const fxlist: string[] = [
    'full',
    'incremental'
];

/**
 * Camera的easing属性中合法的字符串
 */
const cameraeasinglist: string[] = [
    'qi',
    'qo',
    'l',
    'reset',
    's'
];

/**
 * SceneControl的scenetype属性中合法的字符串
 */
const scenetypelist: string[] = [
    'trackshow',
    'trackhide',
    'redline',
    'arcahvdistort',
    'arcahvdebris',
    'hidegroup'
];

export {
    slideeasinglist,
    slideeasingexlist,
    fxlist,
    cameraeasinglist,
    scenetypelist
};

export default {
    slideeasinglist: slideeasinglist,
    slideeasingexlist: slideeasingexlist,
    fxlist: fxlist,
    cameraeasinglist: cameraeasinglist,
    scenetypelist: scenetypelist
};