import {
    Arc,
    Camera,
    NoteGroup,
    Note,
    Flick,
    Hold,
    TimingGroup,
    AffList,
    SceneControl,
    Tap,
    Timing
} from './note/index';
import { sort } from './sorter';

export function stringify(notelist: NoteGroup) {
    notelist = sort(notelist);
    return notelist.toString();
}

function _notestriter(notestr: string, termsign: string) {
    return notestr.slice(0, notestr.indexOf(termsign));
}

export function parseLine(notestr: string) {
    let tempnotestr = notestr.trim();
    const noteobj = new Note(0);
    // 依次切割出note类型，参数，      子表达式（如果有）
    //         keyword  paralist   sub_expression
    const keyword = _notestriter(tempnotestr, '(');
    tempnotestr = tempnotestr.slice(keyword.length + 1, tempnotestr.length);
    const parastr = _notestriter(tempnotestr, ')');
    const paralist = parastr.split(',');
    tempnotestr = tempnotestr.slice(parastr.length + 1, tempnotestr.length);
    const sub_expression = _notestriter(tempnotestr, ';');
    tempnotestr = tempnotestr.slice(keyword.length + 1, tempnotestr.length);

    if(keyword == '' && paralist) {
        return new Tap(
            parseInt(paralist[0]),
            parseInt(paralist[1])
        );
    } else if(keyword == 'hold') {
        return new Hold(
            parseInt(paralist[0]),
            parseInt(paralist[1]),
            parseInt(paralist[2])
        );
    } else if(keyword == 'arc') {
        let isskyline;
        if(paralist[9] == 'true') {
            isskyline = true;
        } else {
            isskyline = false;
            if(paralist[9] != 'false') {
                throw 'AffNoteValueError';
            }
        }
        const skynotetimelist: number[] = [];
        if(sub_expression) {
            const splited = sub_expression.split(',');
            splited.forEach((each) => {
                skynotetimelist.push(parseInt(each.slice(each.indexOf('(') + 1, each.indexOf(')'))));
            });
        }
        return new Arc(
            parseInt(paralist[0]),
            parseInt(paralist[1]),
            parseFloat(paralist[2]),
            parseFloat(paralist[3]),
            paralist[4],
            parseFloat(paralist[5]),
            parseFloat(paralist[6]),
            parseInt(paralist[7]),
            isskyline,
            skynotetimelist,
            paralist[8]
        );
    } else if(keyword == 'timing') {
        return new Timing(
            parseInt(paralist[0]),
            parseFloat(paralist[1]),
            parseFloat(paralist[2])
        );
    } else if(keyword == 'camera') {
        return new Camera(
            parseInt(paralist[0]),
            parseFloat(paralist[1]),
            parseFloat(paralist[2]),
            parseFloat(paralist[3]),
            parseFloat(paralist[4]),
            parseFloat(paralist[5]),
            parseFloat(paralist[6]),
            paralist[7],
            parseInt(paralist[8])
        );
    } else if(keyword == 'scenecontrol') {
        const scenetype = paralist[1];
        if(['trackshow', 'trackhide'].indexOf(scenetype) != -1) {
            return new SceneControl(
                parseInt(paralist[0]),
                scenetype
            );
        } else if(['redline', 'arcahvdistort', 'arcahvdebris', 'hidegroup'].indexOf(scenetype) != -1) {
            return new SceneControl(
                parseInt(paralist[0]),
                scenetype,
                parseFloat(paralist[2]),
                parseInt(paralist[3])
            );
        } else {
            throw 'AffSceneTypeError';
        }
    } else if(keyword == 'flick') {
        return new Flick(
            parseInt(paralist[0]),
            parseFloat(paralist[1]),
            parseFloat(paralist[2]),
            parseFloat(paralist[3]),
            parseFloat(paralist[4])
        );
    } else if(keyword == 'timinggroup') {
        const temptg = new TimingGroup([], paralist.join(','));
        return temptg;
    }
    return noteobj;
}

export function parse(affstr: string) {
    const notestrlist = affstr.split('\n');
    const notelist = new AffList();
    let tempstruct: TimingGroup;
    notestrlist.forEach((eachline) => {
        const stripedlinestr = eachline.trim();
        if(['', '-'].indexOf(stripedlinestr) == -1) {
            if(stripedlinestr.startsWith('AudioOffset:')) {
                notelist.offset = parseInt(stripedlinestr.slice(stripedlinestr.indexOf(':') + 1, stripedlinestr.length));
            } else if(stripedlinestr.startsWith('TimingPointDensityFactor')) {
                notelist.desnity = parseInt(stripedlinestr.slice(stripedlinestr.indexOf(':') + 1, stripedlinestr.length));
            } else if(stripedlinestr == '};') {
                notelist.push(tempstruct);
                tempstruct = new TimingGroup();
            } else {
                const loadednote = parseLine(stripedlinestr);
                if(loadednote instanceof TimingGroup) {
                    if(tempstruct.length == 0) {
                        tempstruct = loadednote;
                    } else {
                        throw 'Timinggroup nesting is not allowed';
                    }
                } else {
                    if(tempstruct) {
                        tempstruct.push(loadednote);
                    } else {
                        notelist.push(loadednote);
                    }
                }
            }
        }
    });
    return notelist;
}

export default {
    stringify: stringify,
    parseLine: parseLine,
    parse: parse
};