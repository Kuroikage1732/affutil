var aff = require("affutil");

var affstr = `
AudioOffset:5
-
timing(0,210.00,4.00);
hold(0,500,1);
(0,4);
(285,2);
arc(571,1071,1.00,1.00,s,1.00,1.00,1,none,false);
`;

var affobj = aff.parse(affstr);
console.log(affobj);
console.log('\n');

var a_normal_list = [
    new aff.note.Timing(0, 222.22),
    new aff.note.Tap(0, 1),
    new aff.note.Hold(0, 100, 2),
    new aff.note.Arc(0, 200, 0, 1, 's', 1, 0, 0, true, [0, 100, 200]),
];

var tg = new aff.note.TimingGroup(
    [new aff.Timing(0, 222.22)],
    'noinput'
);

a_normal_list.push(tg);

var afflist = new aff.note.AffList([], 248, 2);
afflist.concat(a_normal_list);

console.log(afflist.toString());