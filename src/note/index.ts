import { Note, NoteGroup, timeAlign } from './common_note';
import { Tap } from './tap';
import { Hold } from './hold';
import { Arc } from './arc';
import { Timing } from './timing';
import { SceneControl } from './scenecontrol';
import { Camera } from './camera';
import { Flick } from './flick';
import { TimingGroup, AffList } from './notegroup';
import validstrings from './validstrings';

export {
    Note,
    NoteGroup,
    timeAlign,
    Tap,
    Hold,
    Arc,
    Timing,
    SceneControl,
    Camera,
    Flick,
    TimingGroup,
    AffList,
    validstrings
};

export default {
    Note: Note,
    NoteGroup: NoteGroup,
    timeAlign: timeAlign,
    Tap: Tap,
    Hold: Hold,
    Arc: Arc,
    Timing: Timing,
    SceneControl: SceneControl,
    Camera: Camera,
    Flick: Flick,
    TimingGroup: TimingGroup,
    AffList: AffList,
    validstrings: validstrings
};