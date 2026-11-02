// The camera flight path.
//
// One entry per page section, in scroll order. `camera` is where the camera
// sits and `target` is what it looks at. These become control points on a
// Catmull-Rom spline, so the camera curves smoothly between stations instead
// of snapping. Scene objects are positioned to sit inside each station's view.
//
// The world runs along -Z: the hero is at the origin and contact is far away,
// which is why scrolling down reads as flying forward.

export const STATIONS = [
  { id: 'hero', camera: [0, 0, 16], target: [0, 0, 0] },
  { id: 'about', camera: [-4, 1, 0], target: [12, 3, -4] },
  { id: 'skills', camera: [4, 2, -16], target: [-12, -2, -24] },
  { id: 'experience', camera: [-5, 3, -36], target: [11, 4, -46] },
  { id: 'projects', camera: [5, 2, -56], target: [-10, -4, -66] },
  { id: 'achievements', camera: [-4, 3, -76], target: [12, 1, -86] },
  { id: 'contact', camera: [4, 1, -96], target: [-11, 3, -114] },
]

export const NAV = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
]
