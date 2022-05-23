/*
 Highcharts JS v4.2.6 (2016-08-02)

 3D features for Highcharts JS

 @license: www.highcharts.com/license
*/
(function (d) {
  typeof module === "object" && module.exports ? module.exports = d : d(Highcharts);
})(function (d) {
  function C(c) {
    return c !== void 0 && c !== null;
  }

  function H(c) {
    var b = 0,
        a,
        f;

    for (a = 0; a < c.length; a++) f = (a + 1) % c.length, b += c[a].x * c[f].y - c[f].x * c[a].y;

    return b / 2;
  }

  function D(c) {
    var b = 0,
        a;

    for (a = 0; a < c.length; a++) b += c[a].z;

    return c.length ? b / c.length : 0;
  }

  function u(c, b, a, f, e, g, d, j) {
    var k = [];
    g > e && g - e > p / 2 + 1.0E-4 ? (k = k.concat(u(c, b, a, f, e, e + p / 2, d, j)), k = k.concat(u(c, b, a, f, e + p / 2, g, d, j))) : g < e && e - g > p / 2 + 1.0E-4 ? (k = k.concat(u(c, b, a, f, e, e - p / 2, d, j)), k = k.concat(u(c, b, a, f, e - p / 2, g, d, j))) : (k = g - e, k = ["C", c + a * l(e) - a * E * k * q(e) + d, b + f * q(e) + f * E * k * l(e) + j, c + a * l(g) + a * E * k * q(g) + d, b + f * q(g) - f * E * k * l(g) + j, c + a * l(g) + d, b + f * q(g) + j]);
    return k;
  }

  function L(c, b) {
    var a = c.plotLeft,
        f = c.plotWidth + a,
        e = c.plotTop,
        g = c.plotHeight + e,
        d = a + c.plotWidth / 2,
        j = e + c.plotHeight / 2,
        k = Number.MAX_VALUE,
        h = -Number.MAX_VALUE,
        m = Number.MAX_VALUE,
        t = -Number.MAX_VALUE,
        o,
        l = 1;
    o = [{
      x: a,
      y: e,
      z: 0
    }, {
      x: a,
      y: e,
      z: b
    }];
    r([0, 1], function (a) {
      o.push({
        x: f,
        y: o[a].y,
        z: o[a].z
      });
    });
    r([0, 1, 2, 3], function (a) {
      o.push({
        x: o[a].x,
        y: g,
        z: o[a].z
      });
    });
    o = s(o, c, !1);
    r(o, function (a) {
      k = Math.min(k, a.x);
      h = Math.max(h, a.x);
      m = Math.min(m, a.y);
      t = Math.max(t, a.y);
    });
    a > k && (l = Math.min(l, 1 - Math.abs((a + d) / (k + d)) % 1));
    f < h && (l = Math.min(l, (f - d) / (h - d)));
    e > m && (l = m < 0 ? Math.min(l, (e + j) / (-m + e + j)) : Math.min(l, 1 - (e + j) / (m + j) % 1));
    g < t && (l = Math.min(l, Math.abs((g - j) / (t - j))));
    return l;
  }

  function I(c) {
    if (this.chart.is3d()) {
      var b = this.chart.options.plotOptions.column.grouping;
      if (b !== void 0 && !b && this.group.zIndex !== void 0 && !this.zIndexSet) this.group.attr({
        zIndex: this.group.zIndex * 10
      }), this.zIndexSet = !0;
      var a = this.options,
          f = this.options.states;
      this.borderWidth = a.borderWidth = C(a.edgeWidth) ? a.edgeWidth : 1;
      d.each(this.data, function (b) {
        if (b.y !== null) b = b.pointAttr, this.borderColor = d.pick(a.edgeColor, b[""].fill), b[""].stroke = this.borderColor, b.hover.stroke = d.pick(f.hover.edgeColor, this.borderColor), b.select.stroke = d.pick(f.select.edgeColor, this.borderColor);
      });
    }

    c.apply(this, [].slice.call(arguments, 1));
  }

  var M = d.animObject,
      r = d.each,
      N = d.extend,
      O = d.inArray,
      F = d.merge,
      A = d.pick,
      J = d.wrap,
      p = Math.PI,
      B = p / 180,
      q = Math.sin,
      l = Math.cos,
      K = Math.round,
      s = d.perspective = function (c, b, a) {
    var f = b.options.chart.options3d,
        e = a ? b.inverted : !1,
        g = b.plotWidth / 2,
        i = b.plotHeight / 2,
        j = f.depth / 2,
        k = A(f.depth, 1) * A(f.viewDistance, 0),
        h = b.scale3d || 1,
        m = B * f.beta * (e ? -1 : 1),
        f = B * f.alpha * (e ? -1 : 1),
        t = l(f),
        o = l(-m),
        p = q(f),
        n = q(-m);
    a || (g += b.plotLeft, i += b.plotTop);
    return d.map(c, function (a) {
      var b;
      b = -p * n * ((e ? a.y : a.x) - g) + t * ((e ? a.x : a.y) - i) - o * p * ((a.z || 0) - j);
      var c = t * n * ((e ? a.y : a.x) - g) + p * ((e ? a.x : a.y) - i) + t * o * ((a.z || 0) - j),
          f = k > 0 && k < Number.POSITIVE_INFINITY ? k / (c + j + k) : 1;
      a = (o * ((e ? a.y : a.x) - g) - n * ((a.z || 0) - j)) * f;
      b *= f;
      a = a * h + g;
      b = b * h + i;
      return {
        x: e ? b : a,
        y: e ? a : b,
        z: c * h + j
      };
    });
  },
      E = 4 * (Math.sqrt(2) - 1) / 3 / (p / 2);

  d.SVGRenderer.prototype.toLinePath = function (c, b) {
    var a = [];
    d.each(c, function (b) {
      a.push("L", b.x, b.y);
    });
    c.length && (a[0] = "M", b && a.push("Z"));
    return a;
  };

  d.SVGRenderer.prototype.cuboid = function (c) {
    var b = this.g(),
        c = this.cuboidPath(c);
    b.front = this.path(c[0]).attr({
      zIndex: c[3],
      "stroke-linejoin": "round"
    }).add(b);
    b.top = this.path(c[1]).attr({
      zIndex: c[4],
      "stroke-linejoin": "round"
    }).add(b);
    b.side = this.path(c[2]).attr({
      zIndex: c[5],
      "stroke-linejoin": "round"
    }).add(b);

    b.fillSetter = function (a) {
      var b = d.Color(a).brighten(0.1).get(),
          c = d.Color(a).brighten(-0.1).get();
      this.front.attr({
        fill: a
      });
      this.top.attr({
        fill: b
      });
      this.side.attr({
        fill: c
      });
      this.color = a;
      return this;
    };

    b.opacitySetter = function (a) {
      this.front.attr({
        opacity: a
      });
      this.top.attr({
        opacity: a
      });
      this.side.attr({
        opacity: a
      });
      return this;
    };

    b.attr = function (a) {
      if (a.shapeArgs || C(a.x)) a = this.renderer.cuboidPath(a.shapeArgs || a), this.front.attr({
        d: a[0],
        zIndex: a[3]
      }), this.top.attr({
        d: a[1],
        zIndex: a[4]
      }), this.side.attr({
        d: a[2],
        zIndex: a[5]
      });else return d.SVGElement.prototype.attr.call(this, a);
      return this;
    };

    b.animate = function (a, b, c) {
      C(a.x) && C(a.y) ? (a = this.renderer.cuboidPath(a), this.front.attr({
        zIndex: a[3]
      }).animate({
        d: a[0]
      }, b, c), this.top.attr({
        zIndex: a[4]
      }).animate({
        d: a[1]
      }, b, c), this.side.attr({
        zIndex: a[5]
      }).animate({
        d: a[2]
      }, b, c), this.attr({
        zIndex: -a[6]
      })) : a.opacity ? (this.front.animate(a, b, c), this.top.animate(a, b, c), this.side.animate(a, b, c)) : d.SVGElement.prototype.animate.call(this, a, b, c);
      return this;
    };

    b.destroy = function () {
      this.front.destroy();
      this.top.destroy();
      this.side.destroy();
      return null;
    };

    b.attr({
      zIndex: -c[6]
    });
    return b;
  };

  d.SVGRenderer.prototype.cuboidPath = function (c) {
    function b(a) {
      return h[a];
    }

    var a = c.x,
        f = c.y,
        e = c.z,
        g = c.height,
        i = c.width,
        j = c.depth,
        k = d.map,
        h = [{
      x: a,
      y: f,
      z: e
    }, {
      x: a + i,
      y: f,
      z: e
    }, {
      x: a + i,
      y: f + g,
      z: e
    }, {
      x: a,
      y: f + g,
      z: e
    }, {
      x: a,
      y: f + g,
      z: e + j
    }, {
      x: a + i,
      y: f + g,
      z: e + j
    }, {
      x: a + i,
      y: f,
      z: e + j
    }, {
      x: a,
      y: f,
      z: e + j
    }],
        h = s(h, d.charts[this.chartIndex], c.insidePlotArea),
        e = function (a, c) {
      var f = [],
          a = k(a, b),
          c = k(c, b);
      H(a) < 0 ? f = a : H(c) < 0 && (f = c);
      return f;
    },
        c = e([3, 2, 1, 0], [7, 6, 5, 4]),
        a = [4, 5, 2, 3],
        f = e([1, 6, 7, 0], a),
        e = e([1, 2, 5, 6], [0, 7, 4, 3]);

    return [this.toLinePath(c, !0), this.toLinePath(f, !0), this.toLinePath(e, !0), D(c), D(f), D(e), D(k(a, b)) * 9E9];
  };

  d.SVGRenderer.prototype.arc3d = function (c) {
    function b(a) {
      var b = !1,
          c = {},
          f;

      for (f in a) O(f, e) !== -1 && (c[f] = a[f], delete a[f], b = !0);

      return b ? c : !1;
    }

    var a = this.g(),
        f = a.renderer,
        e = "x,y,r,innerR,start,end".split(","),
        c = F(c);
    c.alpha *= B;
    c.beta *= B;
    a.top = f.path();
    a.side1 = f.path();
    a.side2 = f.path();
    a.inn = f.path();
    a.out = f.path();

    a.onAdd = function () {
      var b = a.parentGroup;
      a.top.add(a);
      a.out.add(b);
      a.inn.add(b);
      a.side1.add(b);
      a.side2.add(b);
    };

    a.setPaths = function (b) {
      var c = a.renderer.arc3dPath(b),
          f = c.zTop * 100;
      a.attribs = b;
      a.top.attr({
        d: c.top,
        zIndex: c.zTop
      });
      a.inn.attr({
        d: c.inn,
        zIndex: c.zInn
      });
      a.out.attr({
        d: c.out,
        zIndex: c.zOut
      });
      a.side1.attr({
        d: c.side1,
        zIndex: c.zSide1
      });
      a.side2.attr({
        d: c.side2,
        zIndex: c.zSide2
      });
      a.zIndex = f;
      a.attr({
        zIndex: f
      });
      b.center && (a.top.setRadialReference(b.center), delete b.center);
    };

    a.setPaths(c);

    a.fillSetter = function (a) {
      var b = d.Color(a).brighten(-0.1).get();
      this.fill = a;
      this.side1.attr({
        fill: b
      });
      this.side2.attr({
        fill: b
      });
      this.inn.attr({
        fill: b
      });
      this.out.attr({
        fill: b
      });
      this.top.attr({
        fill: a
      });
      return this;
    };

    r(["opacity", "translateX", "translateY", "visibility"], function (b) {
      a[b + "Setter"] = function (b, c) {
        a[c] = b;
        r(["out", "inn", "side1", "side2", "top"], function (f) {
          a[f].attr(c, b);
        });
      };
    });
    J(a, "attr", function (c, f, e) {
      var d;
      if (typeof f === "object" && (d = b(f))) N(a.attribs, d), a.setPaths(a.attribs);
      return c.call(this, f, e);
    });
    J(a, "animate", function (a, c, f, e) {
      var d,
          m = this.attribs,
          l,
          o;
      delete c.center;
      delete c.z;
      delete c.depth;
      delete c.alpha;
      delete c.beta;
      o = M(A(f, this.renderer.globalAnimation));
      if (o.duration && (c = F(c), d = b(c))) l = d, o.step = function (a, b) {
        function c(a) {
          return m[a] + (A(l[a], m[a]) - m[a]) * b.pos;
        }

        b.elem.setPaths(F(m, {
          x: c("x"),
          y: c("y"),
          r: c("r"),
          innerR: c("innerR"),
          start: c("start"),
          end: c("end")
        }));
      };
      return a.call(this, c, f, e);
    });

    a.destroy = function () {
      this.top.destroy();
      this.out.destroy();
      this.inn.destroy();
      this.side1.destroy();
      this.side2.destroy();
      d.SVGElement.prototype.destroy.call(this);
    };

    a.hide = function () {
      this.top.hide();
      this.out.hide();
      this.inn.hide();
      this.side1.hide();
      this.side2.hide();
    };

    a.show = function () {
      this.top.show();
      this.out.show();
      this.inn.show();
      this.side1.show();
      this.side2.show();
    };

    return a;
  };

  d.SVGRenderer.prototype.arc3dPath = function (c) {
    function b(a) {
      a %= 2 * p;
      a > p && (a = 2 * p - a);
      return a;
    }

    var a = c.x,
        f = c.y,
        e = c.start,
        d = c.end - 1.0E-5,
        i = c.r,
        j = c.innerR,
        k = c.depth,
        h = c.alpha,
        m = c.beta,
        t = l(e),
        o = q(e),
        c = l(d),
        r = q(d),
        n = i * l(m);
    i *= l(h);
    var x = j * l(m),
        y = j * l(h),
        j = k * q(m),
        v = k * q(h),
        k = ["M", a + n * t, f + i * o],
        k = k.concat(u(a, f, n, i, e, d, 0, 0)),
        k = k.concat(["L", a + x * c, f + y * r]),
        k = k.concat(u(a, f, x, y, d, e, 0, 0)),
        k = k.concat(["Z"]),
        s = m > 0 ? p / 2 : 0,
        m = h > 0 ? 0 : p / 2,
        s = e > -s ? e : d > -s ? -s : e,
        w = d < p - m ? d : e < p - m ? p - m : d,
        z = 2 * p - m,
        h = ["M", a + n * l(s), f + i * q(s)],
        h = h.concat(u(a, f, n, i, s, w, 0, 0));
    d > z && e < z ? (h = h.concat(["L", a + n * l(w) + j, f + i * q(w) + v]), h = h.concat(u(a, f, n, i, w, z, j, v)), h = h.concat(["L", a + n * l(z), f + i * q(z)]), h = h.concat(u(a, f, n, i, z, d, 0, 0)), h = h.concat(["L", a + n * l(d) + j, f + i * q(d) + v]), h = h.concat(u(a, f, n, i, d, z, j, v)), h = h.concat(["L", a + n * l(z), f + i * q(z)]), h = h.concat(u(a, f, n, i, z, w, 0, 0))) : d > p - m && e < p - m && (h = h.concat(["L", a + n * l(w) + j, f + i * q(w) + v]), h = h.concat(u(a, f, n, i, w, d, j, v)), h = h.concat(["L", a + n * l(d), f + i * q(d)]), h = h.concat(u(a, f, n, i, d, w, 0, 0)));
    h = h.concat(["L", a + n * l(w) + j, f + i * q(w) + v]);
    h = h.concat(u(a, f, n, i, w, s, j, v));
    h = h.concat(["Z"]);
    m = ["M", a + x * t, f + y * o];
    m = m.concat(u(a, f, x, y, e, d, 0, 0));
    m = m.concat(["L", a + x * l(d) + j, f + y * q(d) + v]);
    m = m.concat(u(a, f, x, y, d, e, j, v));
    m = m.concat(["Z"]);
    t = ["M", a + n * t, f + i * o, "L", a + n * t + j, f + i * o + v, "L", a + x * t + j, f + y * o + v, "L", a + x * t, f + y * o, "Z"];
    a = ["M", a + n * c, f + i * r, "L", a + n * c + j, f + i * r + v, "L", a + x * c + j, f + y * r + v, "L", a + x * c, f + y * r, "Z"];
    r = Math.atan2(v, -j);
    f = Math.abs(d + r);
    c = Math.abs(e + r);
    e = Math.abs((e + d) / 2 + r);
    f = b(f);
    c = b(c);
    e = b(e);
    e *= 1E5;
    d = c * 1E5;
    f *= 1E5;
    return {
      top: k,
      zTop: p * 1E5 + 1,
      out: h,
      zOut: Math.max(e, d, f),
      inn: m,
      zInn: Math.max(e, d, f),
      side1: t,
      zSide1: f * 0.99,
      side2: a,
      zSide2: d * 0.99
    };
  };

  d.Chart.prototype.is3d = function () {
    return this.options.chart.options3d && this.options.chart.options3d.enabled;
  };

  d.wrap(d.Chart.prototype, "isInsidePlot", function (c) {
    return this.is3d() || c.apply(this, [].slice.call(arguments, 1));
  });
  d.getOptions().chart.options3d = {
    enabled: !1,
    alpha: 0,
    beta: 0,
    depth: 100,
    fitToPlot: !0,
    viewDistance: 25,
    frame: {
      bottom: {
        size: 1,
        color: "rgba(255,255,255,0)"
      },
      side: {
        size: 1,
        color: "rgba(255,255,255,0)"
      },
      back: {
        size: 1,
        color: "rgba(255,255,255,0)"
      }
    }
  };
  d.wrap(d.Chart.prototype, "init", function (c) {
    var b = [].slice.call(arguments, 1),
        a;
    if (b[0].chart && b[0].chart.options3d && b[0].chart.options3d.enabled) b[0].chart.options3d.alpha = (b[0].chart.options3d.alpha || 0) % 360, b[0].chart.options3d.beta = (b[0].chart.options3d.beta || 0) % 360, a = b[0].plotOptions || {}, a = a.pie || {}, a.borderColor = d.pick(a.borderColor, void 0);
    c.apply(this, b);
  });
  d.wrap(d.Chart.prototype, "setChartSize", function (c) {
    var b = this.options.chart.options3d;
    c.apply(this, [].slice.call(arguments, 1));

    if (this.is3d()) {
      var a = this.inverted,
          f = this.clipBox,
          d = this.margin;
      f[a ? "y" : "x"] = -(d[3] || 0);
      f[a ? "x" : "y"] = -(d[0] || 0);
      f[a ? "height" : "width"] = this.chartWidth + (d[3] || 0) + (d[1] || 0);
      f[a ? "width" : "height"] = this.chartHeight + (d[0] || 0) + (d[2] || 0);
      this.scale3d = 1;
      if (b.fitToPlot === !0) this.scale3d = L(this, b.depth);
    }
  });
  d.wrap(d.Chart.prototype, "redraw", function (c) {
    if (this.is3d()) this.isDirtyBox = !0;
    c.apply(this, [].slice.call(arguments, 1));
  });
  d.wrap(d.Chart.prototype, "renderSeries", function (c) {
    var b = this.series.length;
    if (this.is3d()) for (; b--;) c = this.series[b], c.translate(), c.render();else c.call(this);
  });

  d.Chart.prototype.retrieveStacks = function (c) {
    var b = this.series,
        a = {},
        f,
        e = 1;
    d.each(this.series, function (d) {
      f = A(d.options.stack, c ? 0 : b.length - 1 - d.index);
      a[f] ? a[f].series.push(d) : (a[f] = {
        series: [d],
        position: e
      }, e++);
    });
    a.totalStacks = e + 1;
    return a;
  };

  d.wrap(d.Axis.prototype, "setOptions", function (c, b) {
    var a;
    c.call(this, b);
    if (this.chart.is3d()) a = this.options, a.tickWidth = d.pick(a.tickWidth, 0), a.gridLineWidth = d.pick(a.gridLineWidth, 1);
  });
  d.wrap(d.Axis.prototype, "render", function (c) {
    c.apply(this, [].slice.call(arguments, 1));

    if (this.chart.is3d()) {
      var b = this.chart,
          a = b.renderer,
          d = b.options.chart.options3d,
          e = d.frame,
          g = e.bottom,
          i = e.back,
          e = e.side,
          j = d.depth,
          k = this.height,
          h = this.width,
          m = this.left,
          l = this.top;
      if (!this.isZAxis) this.horiz ? (i = {
        x: m,
        y: l + (b.xAxis[0].opposite ? -g.size : k),
        z: 0,
        width: h,
        height: g.size,
        depth: j,
        insidePlotArea: !1
      }, this.bottomFrame ? this.bottomFrame.animate(i) : this.bottomFrame = a.cuboid(i).attr({
        fill: g.color,
        zIndex: b.yAxis[0].reversed && d.alpha > 0 ? 4 : -1
      }).css({
        stroke: g.color
      }).add()) : (d = {
        x: m + (b.yAxis[0].opposite ? 0 : -e.size),
        y: l + (b.xAxis[0].opposite ? -g.size : 0),
        z: j,
        width: h + e.size,
        height: k + g.size,
        depth: i.size,
        insidePlotArea: !1
      }, this.backFrame ? this.backFrame.animate(d) : this.backFrame = a.cuboid(d).attr({
        fill: i.color,
        zIndex: -3
      }).css({
        stroke: i.color
      }).add(), b = {
        x: m + (b.yAxis[0].opposite ? h : -e.size),
        y: l + (b.xAxis[0].opposite ? -g.size : 0),
        z: 0,
        width: e.size,
        height: k + g.size,
        depth: j,
        insidePlotArea: !1
      }, this.sideFrame ? this.sideFrame.animate(b) : this.sideFrame = a.cuboid(b).attr({
        fill: e.color,
        zIndex: -2
      }).css({
        stroke: e.color
      }).add());
    }
  });
  d.wrap(d.Axis.prototype, "getPlotLinePath", function (c) {
    var b = c.apply(this, [].slice.call(arguments, 1));
    if (!this.chart.is3d()) return b;
    if (b === null) return b;
    var a = this.chart,
        d = a.options.chart.options3d,
        a = this.isZAxis ? a.plotWidth : d.depth,
        d = this.opposite;
    this.horiz && (d = !d);
    b = [this.swapZ({
      x: b[1],
      y: b[2],
      z: d ? a : 0
    }), this.swapZ({
      x: b[1],
      y: b[2],
      z: a
    }), this.swapZ({
      x: b[4],
      y: b[5],
      z: a
    }), this.swapZ({
      x: b[4],
      y: b[5],
      z: d ? 0 : a
    })];
    b = s(b, this.chart, !1);
    return b = this.chart.renderer.toLinePath(b, !1);
  });
  d.wrap(d.Axis.prototype, "getLinePath", function (c) {
    return this.chart.is3d() ? [] : c.apply(this, [].slice.call(arguments, 1));
  });
  d.wrap(d.Axis.prototype, "getPlotBandPath", function (c) {
    if (!this.chart.is3d()) return c.apply(this, [].slice.call(arguments, 1));
    var b = arguments,
        a = b[1],
        b = this.getPlotLinePath(b[2]);
    (a = this.getPlotLinePath(a)) && b ? a.push("L", b[10], b[11], "L", b[7], b[8], "L", b[4], b[5], "L", b[1], b[2]) : a = null;
    return a;
  });
  d.wrap(d.Tick.prototype, "getMarkPath", function (c) {
    var b = c.apply(this, [].slice.call(arguments, 1));
    if (!this.axis.chart.is3d()) return b;
    b = [this.axis.swapZ({
      x: b[1],
      y: b[2],
      z: 0
    }), this.axis.swapZ({
      x: b[4],
      y: b[5],
      z: 0
    })];
    b = s(b, this.axis.chart, !1);
    return b = ["M", b[0].x, b[0].y, "L", b[1].x, b[1].y];
  });
  d.wrap(d.Tick.prototype, "getLabelPosition", function (c) {
    var b = c.apply(this, [].slice.call(arguments, 1));
    this.axis.chart.is3d() && (b = s([this.axis.swapZ({
      x: b.x,
      y: b.y,
      z: 0
    })], this.axis.chart, !1)[0]);
    return b;
  });
  d.wrap(d.Axis.prototype, "getTitlePosition", function (c) {
    var b = this.chart.is3d(),
        a,
        d;
    if (b) d = this.axisTitleMargin, this.axisTitleMargin = 0;
    a = c.apply(this, [].slice.call(arguments, 1));
    if (b) a = s([this.swapZ({
      x: a.x,
      y: a.y,
      z: 0
    })], this.chart, !1)[0], a[this.horiz ? "y" : "x"] += (this.horiz ? 1 : -1) * (this.opposite ? -1 : 1) * d, this.axisTitleMargin = d;
    return a;
  });
  d.wrap(d.Axis.prototype, "drawCrosshair", function (c) {
    var b = arguments;
    this.chart.is3d() && b[2] && (b[2] = {
      plotX: b[2].plotXold || b[2].plotX,
      plotY: b[2].plotYold || b[2].plotY
    });
    c.apply(this, [].slice.call(b, 1));
  });

  d.Axis.prototype.swapZ = function (c, b) {
    if (this.isZAxis) {
      var a = b ? 0 : this.chart.plotLeft,
          d = this.chart;
      return {
        x: a + (d.yAxis[0].opposite ? c.z : d.xAxis[0].width - c.z),
        y: c.y,
        z: c.x - a
      };
    }

    return c;
  };

  var G = d.ZAxis = function () {
    this.isZAxis = !0;
    this.init.apply(this, arguments);
  };

  d.extend(G.prototype, d.Axis.prototype);
  d.extend(G.prototype, {
    setOptions: function (c) {
      c = d.merge({
        offset: 0,
        lineWidth: 0
      }, c);
      d.Axis.prototype.setOptions.call(this, c);
      this.coll = "zAxis";
    },
    setAxisSize: function () {
      d.Axis.prototype.setAxisSize.call(this);
      this.width = this.len = this.chart.options.chart.options3d.depth;
      this.right = this.chart.chartWidth - this.width - this.left;
    },
    getSeriesExtremes: function () {
      var c = this,
          b = c.chart;
      c.hasVisibleSeries = !1;
      c.dataMin = c.dataMax = c.ignoreMinPadding = c.ignoreMaxPadding = null;
      c.buildStacks && c.buildStacks();
      d.each(c.series, function (a) {
        if (a.visible || !b.options.chart.ignoreHiddenSeries) if (c.hasVisibleSeries = !0, a = a.zData, a.length) c.dataMin = Math.min(A(c.dataMin, a[0]), Math.min.apply(null, a)), c.dataMax = Math.max(A(c.dataMax, a[0]), Math.max.apply(null, a));
      });
    }
  });
  d.wrap(d.Chart.prototype, "getAxes", function (c) {
    var b = this,
        a = this.options,
        a = a.zAxis = d.splat(a.zAxis || {});
    c.call(this);
    if (b.is3d()) this.zAxis = [], d.each(a, function (a, c) {
      a.index = c;
      a.isX = !0;
      new G(b, a).setScale();
    });
  });
  d.wrap(d.seriesTypes.column.prototype, "translate", function (c) {
    c.apply(this, [].slice.call(arguments, 1));

    if (this.chart.is3d()) {
      var b = this.chart,
          a = this.options,
          f = a.depth || 25,
          e = (a.stacking ? a.stack || 0 : this._i) * (f + (a.groupZPadding || 1));
      a.grouping !== !1 && (e = 0);
      e += a.groupZPadding || 1;
      d.each(this.data, function (a) {
        if (a.y !== null) {
          var c = a.shapeArgs,
              d = a.tooltipPos;
          a.shapeType = "cuboid";
          c.z = e;
          c.depth = f;
          c.insidePlotArea = !0;
          d = s([{
            x: d[0],
            y: d[1],
            z: e
          }], b, !0)[0];
          a.tooltipPos = [d.x, d.y];
        }
      });
      this.z = e;
    }
  });
  d.wrap(d.seriesTypes.column.prototype, "animate", function (c) {
    if (this.chart.is3d()) {
      var b = arguments[1],
          a = this.yAxis,
          f = this,
          e = this.yAxis.reversed;
      if (d.svg) b ? d.each(f.data, function (b) {
        if (b.y !== null && (b.height = b.shapeArgs.height, b.shapey = b.shapeArgs.y, b.shapeArgs.height = 1, !e)) b.shapeArgs.y = b.stackY ? b.plotY + a.translate(b.stackY) : b.plotY + (b.negative ? -b.height : b.height);
      }) : (d.each(f.data, function (a) {
        if (a.y !== null) a.shapeArgs.height = a.height, a.shapeArgs.y = a.shapey, a.graphic && a.graphic.animate(a.shapeArgs, f.options.animation);
      }), this.drawDataLabels(), f.animate = null);
    } else c.apply(this, [].slice.call(arguments, 1));
  });
  d.wrap(d.seriesTypes.column.prototype, "init", function (c) {
    c.apply(this, [].slice.call(arguments, 1));

    if (this.chart.is3d()) {
      var b = this.options,
          a = b.grouping,
          d = b.stacking,
          e = A(this.yAxis.options.reversedStacks, !0),
          g = 0;

      if (a === void 0 || a) {
        a = this.chart.retrieveStacks(d);
        g = b.stack || 0;

        for (d = 0; d < a[g].series.length; d++) if (a[g].series[d] === this) break;

        g = 10 * (a.totalStacks - a[g].position) + (e ? d : -d);
        this.xAxis.reversed || (g = a.totalStacks * 10 - g);
      }

      b.zIndex = g;
    }
  });
  d.wrap(d.Series.prototype, "alignDataLabel", function (c) {
    if (this.chart.is3d() && (this.type === "column" || this.type === "columnrange")) {
      var b = arguments[4],
          a = {
        x: b.x,
        y: b.y,
        z: this.z
      },
          a = s([a], this.chart, !0)[0];
      b.x = a.x;
      b.y = a.y;
    }

    c.apply(this, [].slice.call(arguments, 1));
  });
  d.seriesTypes.columnrange && d.wrap(d.seriesTypes.columnrange.prototype, "drawPoints", I);
  d.wrap(d.seriesTypes.column.prototype, "drawPoints", I);
  d.wrap(d.seriesTypes.pie.prototype, "translate", function (c) {
    c.apply(this, [].slice.call(arguments, 1));

    if (this.chart.is3d()) {
      var b = this,
          a = b.options,
          d = a.depth || 0,
          e = b.chart.options.chart.options3d,
          g = e.alpha,
          i = e.beta,
          j = a.stacking ? (a.stack || 0) * d : b._i * d;
      j += d / 2;
      a.grouping !== !1 && (j = 0);
      r(b.data, function (c) {
        var e = c.shapeArgs;
        c.shapeType = "arc3d";
        e.z = j;
        e.depth = d * 0.75;
        e.alpha = g;
        e.beta = i;
        e.center = b.center;
        e = (e.end + e.start) / 2;
        c.slicedTranslation = {
          translateX: K(l(e) * a.slicedOffset * l(g * B)),
          translateY: K(q(e) * a.slicedOffset * l(g * B))
        };
      });
    }
  });
  d.wrap(d.seriesTypes.pie.prototype.pointClass.prototype, "haloPath", function (c) {
    var b = arguments;
    return this.series.chart.is3d() ? [] : c.call(this, b[1]);
  });
  d.wrap(d.seriesTypes.pie.prototype, "drawPoints", function (c) {
    var b = this.options,
        a = b.states;
    if (this.chart.is3d()) this.borderWidth = b.borderWidth = b.edgeWidth || 1, this.borderColor = b.edgeColor = d.pick(b.edgeColor, b.borderColor, void 0), a.hover.borderColor = d.pick(a.hover.edgeColor, this.borderColor), a.hover.borderWidth = d.pick(a.hover.edgeWidth, this.borderWidth), a.select.borderColor = d.pick(a.select.edgeColor, this.borderColor), a.select.borderWidth = d.pick(a.select.edgeWidth, this.borderWidth), r(this.data, function (b) {
      var c = b.pointAttr;
      c[""].stroke = b.series.borderColor || b.color;
      c[""]["stroke-width"] = b.series.borderWidth;
      c.hover.stroke = a.hover.borderColor;
      c.hover["stroke-width"] = a.hover.borderWidth;
      c.select.stroke = a.select.borderColor;
      c.select["stroke-width"] = a.select.borderWidth;
    });
    c.apply(this, [].slice.call(arguments, 1));
    this.chart.is3d() && r(this.points, function (a) {
      var b = a.graphic;
      if (b) b[a.y && a.visible ? "show" : "hide"]();
    });
  });
  d.wrap(d.seriesTypes.pie.prototype, "drawDataLabels", function (c) {
    if (this.chart.is3d()) {
      var b = this.chart.options.chart.options3d;
      r(this.data, function (a) {
        var c = a.shapeArgs,
            d = c.r,
            g = (c.beta || b.beta) * B,
            i = (c.start + c.end) / 2,
            j = a.labelPos,
            k = -d * (1 - l((c.alpha || b.alpha) * B)) * q(i),
            h = d * (l(g) - 1) * l(i);
        r([0, 2, 4], function (a) {
          j[a] += h;
          j[a + 1] += k;
        });
      });
    }

    c.apply(this, [].slice.call(arguments, 1));
  });
  d.wrap(d.seriesTypes.pie.prototype, "addPoint", function (c) {
    c.apply(this, [].slice.call(arguments, 1));
    this.chart.is3d() && this.update(this.userOptions, !0);
  });
  d.wrap(d.seriesTypes.pie.prototype, "animate", function (c) {
    if (this.chart.is3d()) {
      var b = arguments[1],
          a = this.options.animation,
          f = this.center,
          e = this.group,
          g = this.markerGroup;
      if (d.svg) if (a === !0 && (a = {}), b) {
        if (e.oldtranslateX = e.translateX, e.oldtranslateY = e.translateY, b = {
          translateX: f[0],
          translateY: f[1],
          scaleX: 0.001,
          scaleY: 0.001
        }, e.attr(b), g) g.attrSetters = e.attrSetters, g.attr(b);
      } else b = {
        translateX: e.oldtranslateX,
        translateY: e.oldtranslateY,
        scaleX: 1,
        scaleY: 1
      }, e.animate(b, a), g && g.animate(b, a), this.animate = null;
    } else c.apply(this, [].slice.call(arguments, 1));
  });
  d.wrap(d.seriesTypes.scatter.prototype, "translate", function (c) {
    c.apply(this, [].slice.call(arguments, 1));

    if (this.chart.is3d()) {
      var b = this.chart,
          a = d.pick(this.zAxis, b.options.zAxis[0]),
          f = [],
          e,
          g,
          i;

      for (i = 0; i < this.data.length; i++) e = this.data[i], g = a.isLog && a.val2lin ? a.val2lin(e.z) : e.z, e.plotZ = a.translate(g), e.isInside = e.isInside ? g >= a.min && g <= a.max : !1, f.push({
        x: e.plotX,
        y: e.plotY,
        z: e.plotZ
      });

      b = s(f, b, !0);

      for (i = 0; i < this.data.length; i++) e = this.data[i], a = b[i], e.plotXold = e.plotX, e.plotYold = e.plotY, e.plotZold = e.plotZ, e.plotX = a.x, e.plotY = a.y, e.plotZ = a.z;
    }
  });
  d.wrap(d.seriesTypes.scatter.prototype, "init", function (c, b, a) {
    if (b.is3d()) this.axisTypes = ["xAxis", "yAxis", "zAxis"], this.pointArrayMap = ["x", "y", "z"], this.parallelArrays = ["x", "y", "z"], this.directTouch = !0;
    c = c.apply(this, [b, a]);
    if (this.chart.is3d()) this.tooltipOptions.pointFormat = this.userOptions.tooltip ? this.userOptions.tooltip.pointFormat || "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>" : "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>";
    return c;
  });
  if (d.VMLRenderer) d.setOptions({
    animate: !1
  }), d.VMLRenderer.prototype.cuboid = d.SVGRenderer.prototype.cuboid, d.VMLRenderer.prototype.cuboidPath = d.SVGRenderer.prototype.cuboidPath, d.VMLRenderer.prototype.toLinePath = d.SVGRenderer.prototype.toLinePath, d.VMLRenderer.prototype.createElement3D = d.SVGRenderer.prototype.createElement3D, d.VMLRenderer.prototype.arc3d = function (c) {
    c = d.SVGRenderer.prototype.arc3d.call(this, c);
    c.css({
      zIndex: c.zIndex
    });
    return c;
  }, d.VMLRenderer.prototype.arc3dPath = d.SVGRenderer.prototype.arc3dPath, d.wrap(d.Axis.prototype, "render", function (c) {
    c.apply(this, [].slice.call(arguments, 1));
    this.sideFrame && (this.sideFrame.css({
      zIndex: 0
    }), this.sideFrame.front.attr({
      fill: this.sideFrame.color
    }));
    this.bottomFrame && (this.bottomFrame.css({
      zIndex: 1
    }), this.bottomFrame.front.attr({
      fill: this.bottomFrame.color
    }));
    this.backFrame && (this.backFrame.css({
      zIndex: 0
    }), this.backFrame.front.attr({
      fill: this.backFrame.color
    }));
  });
});