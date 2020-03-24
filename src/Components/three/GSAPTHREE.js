let gsap,
  _coreInitted,
  PropTween,
  _getGSAP = () => gsap || (typeof window !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap),
  _contexts = { x: "position", y: "position", z: "position" },
  _DEG2RAD = Math.PI / 180,
  _setterVisible = (target, property, value) => {
    value = !!value
    if (target.visible !== value) {
      target.visible = value
      target.traverse(child => (child.visible = value))
    }
  },
  _degreesToRadians = value =>
    (typeof value === "string" && value.charAt(1) === "=" ? value.substr(0, 2) + parseFloat(value.substr(2)) : value) *
    _DEG2RAD,
  _initCore = core => {
    gsap = core || _getGSAP()
    if (gsap) {
      PropTween = gsap.core.PropTween
      _coreInitted = 1
    }
  }

"position,scale,rotation".split(",").forEach(p => (_contexts[p + "X"] = _contexts[p + "Y"] = _contexts[p + "Z"] = p))

export const ThreePlugin = {
  version: "3.0.0",
  name: "three",
  register: _initCore,
  init(target, vars) {
    if (!_coreInitted) {
      _initCore()
    }
    let context, axis, value, p, i, m
    for (p in vars) {
      context = _contexts[p]
      value = vars[p]
      if (context) {
        i = p.charAt(p.length - 1).toLowerCase()
        axis = ~i.indexOf("x") ? "x" : ~i.indexOf("z") ? "z" : "y"
        this.add(
          target[context],
          axis,
          target[context][axis],
          ~p.indexOf("rotation") ? _degreesToRadians(value) : value
        )
      } else if (p === "scale") {
        this.add(target[p], "x", target[p].x, value)
        this.add(target[p], "y", target[p].y, value)
        this.add(target[p], "z", target[p].z, value)
      } else if (p === "opacity") {
        m = target.material.length ? target.material : [target.material]
        i = m.length
        while (--i > -1) {
          m[i].transparent = true
          this.add(m[i], p, m[i][p], value)
        }
      } else if (p === "visible") {
        if (target.visible !== value) {
          this._pt = new PropTween(this._pt, target, p, value ? 0 : 1, value ? 1 : -1, 0, 0, _setterVisible)
        }
      } else {
        this.add(target, p, target[p], value)
      }
      this._props.push(p)
    }
  }
}

_getGSAP() && gsap.registerPlugin(ThreePlugin)

export { ThreePlugin as default }
