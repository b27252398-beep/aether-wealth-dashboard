import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function NetWorthCrystal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 4.2

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const shellGeometry = new THREE.IcosahedronGeometry(1.3, 1)
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const shell = new THREE.Mesh(shellGeometry, shellMaterial)

    const coreGeometry = new THREE.IcosahedronGeometry(0.75, 0)
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 0.9,
      shininess: 120,
      flatShading: true,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)

    const group = new THREE.Group()
    group.add(shell)
    group.add(core)
    scene.add(group)

    const keyLight = new THREE.PointLight(0x63f7ff, 3, 100)
    keyLight.position.set(4, 3, 4)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xa78bfa, 1.5, 100)
    fillLight.position.set(-4, -2, 2)
    scene.add(fillLight)

    scene.add(new THREE.AmbientLight(0x404040, 1.2))

    let frameId: number
    const clock = new THREE.Clock()

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      group.rotation.y = t * 0.35
      group.rotation.x = Math.sin(t * 0.3) * 0.15
      group.position.y = Math.sin(t * 0.8) * 0.12
      renderer.render(scene, camera)
    }
    animate()

    function handleResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      shellGeometry.dispose()
      shellMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="crystal-canvas" aria-hidden="true" />
}
