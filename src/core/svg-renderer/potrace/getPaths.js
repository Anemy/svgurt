export default function getPaths(pathlist) {
  function path(curve) {
    function bezier(i) {
      const x1 = curve.c[i * 3 + 0].x;
      const y1 = curve.c[i * 3 + 0].y;
      const x2 = curve.c[i * 3 + 1].x;
      const y2 = curve.c[i * 3 + 1].y;
      const x = curve.c[i * 3 + 2].x;
      const y = curve.c[i * 3 + 2].y;

      return {
        type: 'CURVE',
        x1,
        y1,
        x2,
        y2,
        x,
        y
      };
    }

    function segment(i) {
      const x1 = curve.c[i * 3 + 1].x;
      const y1 = curve.c[i * 3 + 1].y;
      const x2 = curve.c[i * 3 + 2].x;
      const y2 = curve.c[i * 3 + 2].y;

      return [
        {
          type: 'POINT',
          x: x1,
          y: y1
        },
        {
          type: 'POINT',
          x: x2,
          y: y2
        }
      ];
    }
    const p = [];

    const n = curve.n;
    let i;
    let s;

    const x = curve.c[(n - 1) * 3 + 2].x;
    const y = curve.c[(n - 1) * 3 + 2].y;

    p.push({
      type: 'POINT',
      x,
      y
    });

    for (i = 0; i < n; i++) {
      if (curve.tag[i] === 'CURVE') {
        p.push(bezier(i));
      } else if (curve.tag[i] === 'CORNER') {
        s = segment(i);
        p.push(s[0], s[1]);
      }
    }
    // p +=
    return p;
  }

  const len = pathlist.length;
  let c;
  let i;

  const paths = [];
  for (i = 0; i < len; i++) {
    c = pathlist[i].curve;
    paths.push(path(c));
  }

  return paths;
}
