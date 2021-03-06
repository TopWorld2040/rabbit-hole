import { ShaderLib, ShaderMaterial, Uniform } from "three";

import fragment from "./glsl/triplanar-physical/shader.frag";
import vertex from "./glsl/triplanar-physical/shader.vert";

// Register custom shader chunks.
import "./triplanar-physical-chunks.js";

/**
 * A physically based shader material that uses triplanar texture mapping.
 */

export class MeshTriplanarPhysicalMaterial extends ShaderMaterial {

	/**
	 * Constructs a new mesh triplanar physical material.
	 */

	constructor() {

		super({

			type: "MeshTriplanarPhysicalMaterial",

			defines: { PHYSICAL: "" },

			uniforms: {

				mapY: new Uniform(null),
				mapZ: new Uniform(null),

				normalMapY: new Uniform(null),
				normalMapZ: new Uniform(null)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			lights: true,
			fog: true

		});

		// Clone uniforms to avoid conflicts with built-in materials.
		const source = ShaderLib.physical.uniforms;
		const target = this.uniforms;

		Object.keys(source).forEach(function(key) {

			const value = source[key].value;
			const uniform = new Uniform(value);

			Object.defineProperty(target, key, {

				value: (value === null) ? uniform : uniform.clone()

			});

		});

		/**
		 * An environment map.
		 *
		 * @type {Texture}
		 */

		this.envMap = null;

	}

	/**
	 * Defines up to three diffuse maps.
	 *
	 * @param {Texture} [mapX] - The map to use for the X plane.
	 * @param {Texture} [mapY] - The map to use for the Y plane.
	 * @param {Texture} [mapZ] - The map to use for the Z plane.
	 */

	setMaps(mapX, mapY, mapZ) {

		const defines = this.defines;
		const uniforms = this.uniforms;

		if(mapX !== undefined) {

			defines.USE_MAP = "";
			uniforms.map.value = mapX;

		}

		if(mapY !== undefined) {

			defines.USE_MAP_Y = "";
			uniforms.mapY.value = mapY;

		}

		if(mapZ !== undefined) {

			defines.USE_MAP_Z = "";
			uniforms.mapZ.value = mapZ;

		}

		this.needsUpdate = true;

	}

	/**
	 * Defines up to three normal maps.
	 *
	 * @param {Texture} [mapX] - The map to use for the X plane.
	 * @param {Texture} [mapY] - The map to use for the Y plane.
	 * @param {Texture} [mapZ] - The map to use for the Z plane.
	 */

	setNormalMaps(mapX, mapY, mapZ) {

		const defines = this.defines;
		const uniforms = this.uniforms;

		if(mapX !== undefined) {

			defines.USE_NORMALMAP = "";
			uniforms.normalMap.value = mapX;

		}

		if(mapY !== undefined) {

			defines.USE_NORMALMAP_Y = "";
			uniforms.normalMapY.value = mapY;

		}

		if(mapZ !== undefined) {

			defines.USE_NORMALMAP_Z = "";
			uniforms.normalMapZ.value = mapZ;

		}

		this.needsUpdate = true;

	}

}
