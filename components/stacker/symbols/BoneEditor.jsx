// components/stacker/symbols/BoneEditor.jsx

"use client";

import { useEffect, useRef } from "react";
import { Circle, Line, Group } from "react-konva";

export default function BoneEditor({ bones = [], onMoveJoint, selectedId, setSelectedId }) {
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.moveToTop();
    }
  }, [bones]);

  return (
    <Group ref={groupRef} listening>
      {bones.map((bone, i) => {
        const isSelected = selectedId === bone.id;
        return (
          <Group key={bone.id}>
            {/* Line between parent and child */}
            <Line
              points={[bone.x, bone.y, bone.childX, bone.childY]}
              stroke={isSelected ? "#e5007d" : "#555"}
              strokeWidth={2}
            />

            {/* Joint (circle) at base */}
            <Circle
              x={bone.x}
              y={bone.y}
              radius={6}
              fill={isSelected ? "#e5007d" : "#888"}
              draggable
              onClick={() => setSelectedId(bone.id)}
              onTap={() => setSelectedId(bone.id)}
              onDragMove={(e) => onMoveJoint(bone.id, { x: e.target.x(), y: e.target.y() })}
            />

            {/* Child joint */}
            <Circle
              x={bone.childX}
              y={bone.childY}
              radius={4}
              fill="#ccc"
              stroke="#666"
              strokeWidth={1}
            />
          </Group>
        );
      })}
    </Group>
  );
}
