export const addClass = (el, className) => {
  el.classList.add(className)
}
export const romveClass = (el, className) => {
  el.classList.romove(className)
}

export const getData = (el, name, val) => {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}
