import { Box3, Vector3 } from "math-ds";
import { SignedDistanceFunction } from "./SignedDistanceFunction.js";
import { SDFType } from "./SDFType.js";

/**
 * A Signed Distance Function that describes a heightfield.
 *
 * @implements {Serializable}
 */

export class Heightfield extends SignedDistanceFunction {

	/**
	 * Constructs a new heightfield SDF.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.min - The min position [x, y, z].
	 * @param {Array} parameters.dimensions - The dimensions [x, y, z].
	 * @param {Uint8ClampedArray} parameters.data - The heightmap data.
	 * @param {Number} [material] - A material index.
	 */

	constructor(parameters = {}, material) {

		super(SDFType.HEIGHTFIELD, material);

		/**
		 * The position.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.min = new Vector3(...parameters.min);

		/**
		 * The dimensions.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.dimensions = new Vector3(...parameters.size);

		/**
		 * The height data.
		 *
		 * @type {Uint8ClampedArray}
		 * @private
		 */

		this.data = parameters.data;

	}

	/**
	 * Calculates the bounding box of this density field.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		this.bbox = new Box3();

		this.bbox.min.copy(this.min);
		this.bbox.max.addVectors(this.min, this.dimensions);

		return this.bbox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		const min = this.min;
		const dimensions = this.dimensions;

		const x = Math.max(min.x, Math.min(min.x + dimensions.x, position.x - min.x));
		const z = Math.max(min.z, Math.min(min.z + dimensions.z, position.z - min.z));

		const y = position.y - min.y;

		return y - (this.data[z * dimensions.x + x] / 255) * dimensions.y;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @return {Object} A serialised description of this SDF.
	 */

	serialize() {

		const result = super.serialise();

		result.parameters = {
			min: this.min.toArray(),
			dimensions: this.dimensions.toArray(),
			data: this.data
		};

		return result;

	}

}
