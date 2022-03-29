/**
 * Function that removes a block when we click on it
 */

import { Camera, InstancedMesh, Raycaster, Scene, Vector2 } from "three";

import { getCurrentChunk } from "../utils";
import displayChunk from "./displayChunks";

import { BLOCK_SIZE, RAYCASTER_DISTANCE } from "../constants";
import { Chunks, Reference } from "../types";

const removeBlock = (
  camera: Camera,
  instancedMesh: Reference<InstancedMesh>,
  chunks: Chunks,
  displayableChunks: Reference<Chunks>,
  scene: Scene
) => {
  // Throw a raycast to detect which block to remove
  const raycaster = new Raycaster();
  const pointer = new Vector2(0,0);

  raycaster.setFromCamera(pointer, camera);
  const intersection = raycaster.intersectObject(instancedMesh.value);

  // Check if we're intersecting an object in range in order to remove it
  if (intersection.length && intersection[0].distance <= RAYCASTER_DISTANCE) {
    const materialIndex = intersection[0].face.materialIndex; // Get the face of the block we want to remove
    const position = intersection[0].point; // Get the coordinates of the face we're pointing at
    const increment = BLOCK_SIZE / 2;
    let x: number, y: number, z: number; // Coordinates of the block we're removing
    // Determine the position of the block based on the face we're aiming at
    switch (materialIndex) {
      case 0: // Right
        x = position.x - increment;
        y = Math.round(position.y / BLOCK_SIZE) * BLOCK_SIZE;
        z = Math.round(position.z / BLOCK_SIZE) * BLOCK_SIZE;
        break;
      case 1: // Left
        x = position.x + increment;
        y = Math.round(position.y / BLOCK_SIZE) * BLOCK_SIZE;
        z = Math.round(position.z / BLOCK_SIZE) * BLOCK_SIZE;
        break;
      case 2: // Top
        x = Math.round(position.x / BLOCK_SIZE) * BLOCK_SIZE;
        y = position.y - increment;
        z = Math.round(position.z / BLOCK_SIZE) * BLOCK_SIZE;
        break;
      case 3: // Bottom
        x = Math.round(position.x / BLOCK_SIZE) * BLOCK_SIZE;
        y = position.y + increment;
        z = Math.round(position.z / BLOCK_SIZE) * BLOCK_SIZE;
        break;
      case 4: // Front
        x = Math.round(position.x / BLOCK_SIZE) * BLOCK_SIZE;
        y = Math.round(position.y / BLOCK_SIZE) * BLOCK_SIZE;
        z = position.z - increment;
        break;
      case 5: // Back
        x = Math.round(position.x / BLOCK_SIZE) * BLOCK_SIZE;
        y = Math.round(position.y / BLOCK_SIZE) * BLOCK_SIZE;
        z = position.z + increment;
        break;
    }
    // Get the chunk the block is on
    const chunk = getCurrentChunk(x, z);
    // Remove the block from the chunk
    const blockKey = `${x},${z}`;
    chunks[chunk][blockKey] = chunks[chunk][blockKey].filter(block => y !== block.y);
    // Display the chunks with the block removed
    displayChunk(scene, instancedMesh, displayableChunks.value);
  }
};

export default removeBlock;