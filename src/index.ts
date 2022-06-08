import note from './note/index';
import { stringify, parseLine, parse } from './parser';

const parser = {
    stringify,
    parseLine,
    parse
};

const aff = {
    note,
    parser,
    stringify,
    parseLine,
    parse
};

Object.assign(aff, note);

export default aff;