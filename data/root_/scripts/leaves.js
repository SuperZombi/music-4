const body_ = document.getElementById('leaves_area');


let $mm = Object.assign((s, attrs) => {
  if (s === null) { return null }
  let el
  if (s instanceof Element || s instanceof HTMLDocument || s instanceof Window) {
    el = s
  } else {
    let match = s.match(/<\/?(.*?)>/)
    el = match ? $mm.create(match[1], attrs) : $mm.find(s)
  }
  if (el === null) { return null }
  $mm.merge(el, $mm.fn)
  Object.defineProperty(el, 'val', {
    configurable: true,
    get: () => el.value,
    set: v => { el.value = v }
  })
  Object.defineProperty(el, 'parent', {
    configurable: true,
    get: () => $mm(el.parentElement)
  })
  Object.defineProperty(el, 'next', {
    configurable: true,
    get: () => $mm(el.nextElementSibling),
    set: v => el.appendAfter(v)
  })
  Object.defineProperty(el, 'prev', {
    configurable: true,
    get: () => $mm(el.previousElementSibling),
    set: v => el.appendBefore(v)
  })
  Object.defineProperty(el, 'bounds', {
    configurable: true,
    get: () => el.getBoundingClientRect()
  })
  Object.defineProperty(el, 'text', {
    configurable: true,
    get: () => el.textContent,
    set: v => { el.textContent = v }
  })
  Object.defineProperty(el, 'html', {
    configurable: true,
    get: () => el.innerHTML,
    set: v => { el.innerHTML = v }
  })
  return el
}, {
  find: s => $mm(document.querySelector(s)),
  findAll: s => [...document.querySelectorAll(s)].map(e => $mm(e)),
  create: (elName, attrs) => {
    let el = document.createElement(elName)

    if (attrs !== undefined) {
      let keys = Object.keys(attrs)
      let styleKey = keys.find(k => k.toLowerCase() === 'style' && $mm.isObj(attrs[k]))
      let innerHtmlKey = keys.find(k => k.toLowerCase() === 'innerhtml' || k.toLowerCase() === 'html')
      if (styleKey !== undefined) {
        for (let k in attrs[styleKey]) {
          el.style[k] = attrs[styleKey][k]
        }
        delete attrs[styleKey]
      }
      if (innerHtmlKey !== undefined) {
        el.innerHTML = attrs[innerHtmlKey]
        delete attrs[innerHtmlKey]
      }

      for (let k in attrs) {
        el.setAttribute(k, attrs[k])
      }
    }

    return $mm(el)
  },
  createSvg: (elName, attrs) => {
    let el = document.createElementNS('http://www.w3.org/2000/svg', elName)

    if (attrs !== undefined) {
      let keys = Object.keys(attrs)
      let styleKey = keys.find(k => k.toLowerCase() === 'style' && $mm.isObj(attrs[k]))
      let innerHtmlKey = keys.find(k => k.toLowerCase() === 'innerhtml' || k.toLowerCase() === 'html')
      if (styleKey !== undefined) {
        for (let k in attrs[styleKey]) {
          el.style[k] = attrs[styleKey][k]
        }
        delete attrs[styleKey]
      }
      if (innerHtmlKey !== undefined) {
        el.innerHTML = attrs[innerHtmlKey]
        delete attrs[innerHtmlKey]
      }

      for (let k in attrs) { el.setAttribute(k, attrs[k]) }
    }

    return $mm(el)
  },
  rand: (max = 1, min = 0) => Math.random() * (max - min) + min,
  randInt: (max, min = 0) => ~~(Math.random() * (max - min) + min),
  randArr: arr => arr[$mm.randInt(arr.length)],
  isObj: obj => typeof obj === 'object' && obj.constructor !== RegExp && obj.constructor !== Date,
  merge: (deep, ...objs) => {
    if (deep !== true) { return Object.assign(deep, ...objs) }

    return objs.reduce((dest, src) => {
      if (Array.isArray(src)) {
        return Array.isArray(dest) ? dest.concat(src) : src
      }

      Object.keys(src).forEach(k => {
        if (src[k] && $mm.isObj(src[k])) {
          $mm.merge(true, dest[k], src[k])
        } else {
          dest[k] = src[k]
        }
      })
      return dest
    })
  },
  extend: (...objs) => {
    return $mm.merge($mm, ...objs)
  },
  round: (num, prec = 2) => {
    let x = 10 ** prec
    return Math.round(num * x) / x
  },
  dist: (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y),
  cssVar: (v, val) => {
    if (val === undefined) {
      return window.getComputedStyle(body_).getPropertyValue(`--${v}`).trim()
    }
    document.documentElement.style.setProperty(`--${v}`, val)
  },
  array: (n, fn) => Array.from({length: n}, fn),
  fn: {
    find: function (s) { return $mm(this.querySelector(s)) },
    findAll: function (s) { return [...this.querySelectorAll(s)].map(e => $mm(e)) },
    on: function (type, ...args) {
      for (let t of type.split(' ')) {
        this.addEventListener(t, ...args)
      }
      return this
    },
    appendBefore: function (el) {
      this.parent.insertBefore(el, this)
      return this
    },
    appendAfter: function (el) {
      this.parent.insertBefore(el, this.nextSibling)
      return this
    },
    appendTo: function (el) {
      el.append(this)
      return this
    },
    addClass: function (c) {
      this.classList.add(c)
      return this
    },
    removeClass: function (c) {
      this.classList.remove(c)
      return this
    },
    toggleClass: function (c) {
      this.classList.toggle(c)
      return this
    },
    hasClass: function (c) {
      return this.classList.contains(c)
    },
    attr: function (a, val) {
      if (val === undefined) {
        return this.getAttribute(a)
      }
      this.setAttribute(a, val)
      return this
    },
    data: function (a, val) {
      if (val === undefined) {
        return this.getAttribute(`data-${a}`)
      }
      this.setAttribute(`data-${a}`, val)
      return this
    },
    getStyle: function (...attrs) {
      let style = window.getComputedStyle(this)

      let ret = {}
      if (attrs.length > 1) {
        for (let a of attrs) {
          ret[a] = style.getPropertyValue(a)
        }
      } else if (attrs.length === 1) {
        ret = style.getPropertyValue(attrs[0])
      } else {
        for (let a in style) {
          ret[a] = style.getPropertyValue(a)
        }
      }

      return ret
    },
    serialize: function () {
      let obj = {}
      this.findAll('input, select, textarea').forEach(field => {
        switch (field.type) {
          case 'checkbox':
            obj[field.name] = field.checked
            break
          case 'radio':
            if (field.checked) {
              obj[field.name] = field.value
            } else if (!(field.name in obj)) {
              obj[field.name] = null
            }
            break
          default:
            obj[field.name] = field.value
        }
      })
      return obj
    },
    validate: function () {
      let fields = this.findAll('[data-required]')
      let obj = {}
      fields.forEach(field => {
        switch (field.type) {
          case 'checkbox':
            break
          case 'radio':
            if (field.checked) {
              obj[field.name] = true
            } else if (!(field.name in obj)) {
              obj[field.name] = false
            }
            break
          default:
            obj[field.name] = field.value.length && field.validity.valid
        }
      })
      let valid = Object.values(obj).every(e => e)

      if (!valid) {
        fields.forEach(field => field.attr('required', ''))
      }

      return $mm.merge({valid: valid}, obj)
    },
    extend: (...objs) => {
      return $mm.merge($mm.fn, ...objs)
    }
  }
})



const fragment = document.createDocumentFragment();

const root = $mm.createSvg('svg', {
  viewBox: `0 0 ${body_.offsetWidth} ${body_.offsetHeight}`,
  style: "margin: auto;"
});

fragment.append(root);

window.addEventListener('resize', () => root.attr('viewBox', `0 0 ${body_.offsetWidth} ${body_.offsetHeight}`));

let side = [-60, 0];
let cBot = [side[0], 70];
let cTop = [side[0], -40];
let d = `M0,100 Q${cBot} ${side} Q${cTop} 0,-100 Q${-cTop[0]},${cTop[1]} ${-side[0]},${side[1]} Q${-cBot[0]},${cBot[1]} 0,100`;

function createLeaf() {
  let leaf = $mm.createSvg('g');

  leaf.append($mm.createSvg('path', {
    style: {
      transform: 'translate(0, 100px) rotate(-70deg)' },

    d: d }));


  leaf.append($mm.createSvg('path', {
    style: {
      transform: 'translate(100px, 100px) rotate(60deg)' },

    d: d }));


  leaf.append($mm.createSvg('path', {
    style: {
      transform: 'translate(0, 50px) rotate(-40deg)' },

    d: d }));


  leaf.append($mm.createSvg('path', {
    style: {
      transform: 'translate(100px, 50px) rotate(20deg)' },

    d: d }));


  leaf.append($mm.createSvg('path', {
    style: {
      transform: 'translate(50px, 0) rotate(0deg)' },

    d: d }));


  let stem = $mm.createSvg('g', { class: 'stem' });
  leaf.append(stem);

  stem.append($mm.createSvg('path', {
    style: {
      transform: 'translate(45px, 100px) rotate(5deg)' },

    d: 'M0,100 L0,-100 C20,-80 10,80 0,100' }));


  stem.append($mm.createSvg('path', {
    style: {
      transform: 'translate(85px, 40px) rotate(40deg) scale(.5)' },

    d: 'M0,100 L0,-100 C20,-80 10,80 0,100' }));


  stem.append($mm.createSvg('path', {
    style: {
      transform: 'translate(5px, 110px) rotate(-70deg) scale(.5)' },

    d: 'M0,100 L0,-100 C20,-80 10,80 0,100' }));


  return leaf;
}

const storage = $mm.createSvg('svg', { id: 'storage' });
fragment.append(storage);

let leafTemplate = createLeaf();
leafTemplate.id = 'leafTemplate';

storage.append(leafTemplate);

let colors = [
'light-red', 'light-orange', 'light-yellow', 'light-green', 'light-purple',
'red', 'orange', 'yellow', 'green', 'purple',
'dark-red', 'dark-orange', 'dark-yellow', 'dark-green', 'dark-purple'];


let leaves = [];

for (let i = 50; i--;) {
  let speed = $mm.rand(.75, .15);
  let x = $mm.randInt(window.innerWidth);
  let y = -100 - $mm.randInt(300);
  let angle = $mm.randInt(360);
  let newLeaf = $mm.createSvg('use', {
    href: '#leafTemplate',
    class: $mm.randArr(colors),
    style: {
      transform: `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${$mm.rand(.25, .125)})`,
      'transition-timing-function': 'linear',
      'transition-duration': `${(window.innerHeight - y) / speed * 10}ms` } });


  leaves.push(newLeaf);
  root.append(newLeaf);

  setTimeout(() => {
    newLeaf.style.transform = newLeaf.style.transform.replace(/translate\((.*?),.*?\) rotate\(.*?\)/, `translate(${x + $mm.randInt((window.innerHeight - y) / 50, -(window.innerHeight - y) / 50)}px, ${window.innerHeight + 100}px) rotate(${angle + $mm.randInt((window.innerHeight - y) / 5)}deg)`);

    newLeaf.on('transitionend', resetLeaf);
  }, 10);

  function resetLeaf() {
    newLeaf.removeEventListener('transitionend', resetLeaf);

    newLeaf.style['transition-duration'] = '0ms';

    setTimeout(() => {
      let x = $mm.randInt(window.innerWidth);
      let y = -100 - $mm.randInt(300);
      let speed = $mm.rand(.75, .15);
      let angle = $mm.randInt(360);
      newLeaf.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${$mm.rand(.25, .125)})`;

      setTimeout(() => {
        newLeaf.style['transition-duration'] = `${(window.innerHeight - y) / speed * 10}ms`;

        setTimeout(() => {
          newLeaf.style.transform = newLeaf.style.transform.replace(/translate\((.*?),.*?\) rotate\(.*?\)/, `translate(${x + $mm.randInt(window.innerHeight / 50, -window.innerHeight / 50)}px, ${window.innerHeight + 100}px) rotate(${angle + $mm.randInt((window.innerHeight - y) / 5)}deg)`);

          newLeaf.on('transitionend', resetLeaf);
        }, 100);
      }, 100);
    }, 100);
  }
}

body_.append(fragment);