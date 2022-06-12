import { sortBy } from 'lodash-es';
import { Note, NoteGroup } from './note/index';

export function sort(unsorted: NoteGroup) {
    const sortable_timing: any = new NoteGroup();
    const sortable_tap: any = new NoteGroup();
    const sortable_hold: any = new NoteGroup();
    const sortable_arc: any = new NoteGroup();
    const sortable_camera: any = new NoteGroup();
    const sortable_scene: any = new NoteGroup();
    const sortable_group: any = new NoteGroup();
    const sortedlist: NoteGroup = new unsorted.constructor.prototype.constructor();

    unsorted.forEach((eachnote: Note | NoteGroup) => {
        if(eachnote) {
            if(eachnote.type == 'Timing') {
                sortable_timing.push(eachnote);
            } else if (eachnote.type == 'Tap') {
                sortable_tap.push(eachnote);
            } else if(eachnote.type == 'Hold') {
                sortable_hold.push(eachnote);
            } else if(eachnote.type == 'Arc') {
                sortable_arc.push(eachnote);
            } else if(eachnote.type == 'Camera') {
                sortable_camera.push(eachnote);
            } else if(eachnote.type == 'SceneControl') {
                sortable_scene.push(eachnote);
            } else if(eachnote.type == 'TimingGroup' && eachnote instanceof NoteGroup) {
                sortable_group.push(sort(eachnote));
            }
        }
    });
    sortedlist.concat(sortBy(sortable_camera, ['time']));
    sortedlist.concat(sortBy(sortable_timing, ['time']));
    sortedlist.concat(sortBy(sortable_scene, ['time']));
    sortedlist.concat(sortBy(sortable_tap, ['time', 'lane']));
    sortedlist.concat(sortBy(sortable_hold, ['time', 'lane', 'totime']));
    sortedlist.concat(sortBy(sortable_arc, ['time', 'fromx', 'fromy', 'totime', 'tox', 'toy']));
    sortedlist.sort((a: any, b: any) => { return a.time - b.time; });
    sortedlist.concat(sortable_group);

    return sortedlist;
}