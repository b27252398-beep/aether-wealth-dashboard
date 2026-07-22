import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useBudgetStore } from '../store/useBudgetStore'

export default function NetWorthCrystal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const netWorth = useBudgetStore((s) => s.totals().netWorth)

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

    // Determine colors based on net worth
    const isPositive = netWorth >= 0
    const colorHex = isPositive ? 0x00f5ff : 0xff6b6b
    const emissiveHex = isPositive ? 0x00f5ff : 0xff4f4f

    const shellGeometry = new THREE.IcosahedronGeometry(1.3, 1)
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: colorHex,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const shell = new THREE.Mesh(shellGeometry, shellMaterial)

    const coreGeometry = new THREE.IcosahedronGeometry(0.75, 0)
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: colorHex,
      emissive: emissiveHex,
      emissiveIntensity: 0.9,
      shininess: 120,
      flatShading: true,
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)

    const group = new THREE.Group()
    group.add(shell)
    group.add(core)
    scene.add(group)

    const keyLight = new THREE.PointLight(isPositive ? 0x63f7ff : 0xff8f8f, 3, 100)
    keyLight.position.set(4, 3, 4)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(isPositive ? 0xa78bfa : 0xffb8b8, 1.5, 100)
    fillLight.position.set(-4, -2, 2)
    scene.add(fillLight)

    scene.add(new THREE.AmbientLight(0x404040, 1.2))

    let frameId: number
    const clock = new THREE.Clock()

    // Mouse interaction
    let targetRotationX = 0
    let targetRotationY = 0
    let mouseX = 0
    let mouseY = 0
    const windowHalfX = window.innerWidth / 2
    const windowHalfY = window.innerHeight / 2

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.0005
      mouseY = (event.clientY - windowHalfY) * 0.0005
    }
    document.addEventListener('mousemove', onDocumentMouseMove)

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      
      // Auto-rotation + Mouse Interaction
      targetRotationY = t * 0.35 + mouseX
      targetRotationX = Math.sin(t * 0.3) * 0.15 + mouseY

      // Smooth rotation interpolation
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.1
      group.rotation.x += (targetRotationX - group.rotation.x) * 0.1
      
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
      document.removeEventListener('mousemove', onDocumentMouseMove)
      shellGeometry.dispose()
      shellMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [netWorth]) // Re-run effect if netWorth polarity changes

  return <div ref={containerRef} className="crystal-canvas" aria-hidden="true" style={{ transition: 'opacity 0.3s ease' }} />
}
