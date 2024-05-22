/* eslint-disable react-hooks/exhaustive-deps */
import { DragEvent, ResizeEvent } from "@interactjs/types/index";
import React, { ReactElement, cloneElement, useEffect, useImperativeHandle, useRef } from "react";
import { Direction, RowRndApi, RowRndProps } from "./row_rnd_interface";
import { useAutoScroll } from "./use-auto-scroll";
import interact from "interactjs";
import { Interactable } from "@interactjs/core/Interactable";

export const RowDnd = React.forwardRef<RowRndApi, RowRndProps>(
  (
    {
      children,
      edges,
      left,
      width,
      enableDragging,
      enableResizing,
      start = 20,
      grid = 1,
      bounds = {
        left: Number.MIN_SAFE_INTEGER,
        right: Number.MAX_SAFE_INTEGER
      },
      adsorptionDistance = 8,
      adsorptionPositions = [],
      onResizeStart,
      onResize,
      onResizeEnd,
      onDragStart,
      onDragEnd,
      onDrag,
      parentRef,
      deltaScrollLeft
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLElement>(null);
    const interactableRef = useRef<Interactable>();
    const deltaX = useRef(0);
    const isAdsorption = useRef(false);
    const { initAutoScroll, dealDragAutoScroll, dealResizeAutoScroll, stopAutoScroll } = useAutoScroll(parentRef!);

    useImperativeHandle(ref, () => ({
      updateLeft: left => handleUpdateLeft(left || 0, false),
      updateWidth: width => handleUpdateWidth(width, false),
      getLeft: handleGetLeft,
      getWidth: handleGetWidth
    }));

    useEffect(() => {
      const target = nodeRef.current as HTMLElement;
      handleUpdateWidth(typeof width === "undefined" ? target.offsetWidth : width, false);
    }, [width]);

    useEffect(() => {
      handleUpdateLeft(left || 0, false);
    }, [left]);

    const handleUpdateLeft = (left: number, reset = true) => {
      if (!nodeRef.current) return;
      reset && (deltaX.current = 0);
      const target = nodeRef.current;
      target.style.left = `${left}px`;
      Object.assign(target.dataset, { left });
    };

    const handleUpdateWidth = (width: number, reset = true) => {
      if (!nodeRef.current) return;
      reset && (deltaX.current = 0);
      const target = nodeRef.current;
      target.style.width = `${width}px`;
      Object.assign(target.dataset, { width });
    };

    const handleGetLeft = () => {
      const target = nodeRef.current;
      return parseFloat(target?.dataset?.left || "0");
    };
    const handleGetWidth = () => {
      const target = nodeRef.current;
      return parseFloat(target?.dataset?.width || "0");
    };

    const handleMoveStart = () => {
      deltaX.current = 0;
      isAdsorption.current = false;
      initAutoScroll();
      onDragStart && onDragStart();
    };

    const move = (param: { preLeft: number; preWidth: number; scrollDelta?: number }) => {
      const { preLeft, preWidth, scrollDelta } = param;
      const distance = isAdsorption.current ? adsorptionDistance : grid;
      if (Math.abs(deltaX.current) >= distance) {
        const count = deltaX.current / distance;
        let curLeft = preLeft + count * distance;

        let adsorption = curLeft;
        const minDis = Number.MAX_SAFE_INTEGER;
        adsorptionPositions.forEach(item => {
          const dis = Math.abs(item - curLeft);
          if (dis < adsorptionDistance && dis < minDis) adsorption = item;
          const dis2 = Math.abs(item - (curLeft + preWidth));
          if (dis2 < adsorptionDistance && dis2 < minDis) adsorption = item - preWidth;
        });

        if (adsorption !== curLeft) {
          isAdsorption.current = true;
          curLeft = adsorption;
        } else {
          if ((curLeft - start) % grid !== 0) {
            curLeft = start + grid * Math.round((curLeft - start) / grid);
          }
          isAdsorption.current = false;
        }
        deltaX.current = deltaX.current % distance;

        if (curLeft < bounds.left) curLeft = bounds.left;
        else if (curLeft + preWidth > bounds.right) curLeft = bounds.right - preWidth;

        if (onDrag) {
          const ret = onDrag(
            {
              lastLeft: preLeft,
              left: curLeft,
              lastWidth: preWidth,
              width: preWidth
            },
            scrollDelta
          );
          if (ret === false) return;
        }

        handleUpdateLeft(curLeft, false);
      }
    };

    const handleMove = (e: DragEvent) => {
      const target = e.target;
      if (deltaScrollLeft && parentRef?.current) {
        const result = dealDragAutoScroll(e, delta => {
          deltaScrollLeft(delta);

          const { left, width } = target.dataset;
          const preLeft = parseFloat(left || "0");
          const preWidth = parseFloat(width || "0");
          deltaX.current += delta;
          move({ preLeft, preWidth, scrollDelta: delta });
        });
        if (!result) return;
      }

      const { left, width } = target.dataset;
      const preLeft = parseFloat(left || "0");
      const preWidth = parseFloat(width || "0");

      deltaX.current += e.dx;
      move({ preLeft: preLeft, preWidth });
    };

    const handleMoveStop = (e: DragEvent) => {
      deltaX.current = 0;
      isAdsorption.current = false;
      stopAutoScroll();

      const target = e.target;

      const { left, width } = target.dataset;

      onDragEnd && onDragEnd({ left: parseFloat(left || "0"), width: parseFloat(width || "0") });
    };

    const handleResizeStart = (e: ResizeEvent) => {
      deltaX.current = 0;
      isAdsorption.current = false;
      initAutoScroll();

      const dir: Direction = e.edges?.right ? "right" : "left";
      onResizeStart && onResizeStart(dir);
    };
    const resize = (param: { preLeft: number; preWidth: number; dir: "left" | "right" }) => {
      const { dir, preWidth, preLeft } = param;
      const distance = isAdsorption.current ? adsorptionDistance : grid;

      if (dir === "left") {
        if (Math.abs(deltaX.current) >= distance) {
          const count = parseInt(deltaX.current / distance + "");
          let curLeft = preLeft + count * distance;

          let adsorption = curLeft;
          const minDis = Number.MAX_SAFE_INTEGER;
          adsorptionPositions.forEach(item => {
            const dis = Math.abs(item - curLeft);
            if (dis < adsorptionDistance && dis < minDis) adsorption = item;
          });

          if (adsorption !== curLeft) {
            isAdsorption.current = true;
            curLeft = adsorption;
          } else {
            if ((curLeft - start) % grid !== 0) {
              curLeft = start + grid * Math.round((curLeft - start) / grid);
            }
            isAdsorption.current = false;
          }
          deltaX.current = deltaX.current % distance;

          const tempRight = preLeft + preWidth;
          if (curLeft < bounds.left) curLeft = bounds.left;
          const curWidth = tempRight - curLeft;

          if (onResize) {
            const ret = onResize("left", {
              lastLeft: preLeft,
              lastWidth: preWidth,
              left: curLeft,
              width: curWidth
            });
            if (ret === false) return;
          }

          handleUpdateLeft(curLeft, false);
          handleUpdateWidth(curWidth, false);
        }
      } else if (dir === "right") {
        if (Math.abs(deltaX.current) >= distance) {
          const count = parseInt(deltaX.current / grid + "");
          let curWidth = preWidth + count * grid;

          let adsorption = preLeft + curWidth;
          const minDis = Number.MAX_SAFE_INTEGER;
          adsorptionPositions.forEach(item => {
            const dis = Math.abs(item - (preLeft + curWidth));
            if (dis < adsorptionDistance && dis < minDis) adsorption = item;
          });

          if (adsorption !== preLeft + curWidth) {
            isAdsorption.current = true;
            curWidth = adsorption - preLeft;
          } else {
            let tempRight = preLeft + curWidth;
            if ((tempRight - start) % grid !== 0) {
              tempRight = start + grid * Math.round((tempRight - start) / grid);
              curWidth = tempRight - preLeft;
            }
            isAdsorption.current = false;
          }
          deltaX.current = deltaX.current % distance;

          if (preLeft + curWidth > bounds.right) curWidth = bounds.right - preLeft;

          if (onResize) {
            const ret = onResize("right", {
              lastLeft: preLeft,
              lastWidth: preWidth,
              left: preLeft,
              width: curWidth
            });
            if (ret === false) return;
          }

          handleUpdateWidth(curWidth, false);
        }
      }
    };

    const handleResize = (e: ResizeEvent) => {
      const target = e.target;
      const dir = e.edges?.left ? "left" : "right";

      if (deltaScrollLeft && parentRef?.current) {
        const result = dealResizeAutoScroll(e, dir, delta => {
          deltaScrollLeft(delta);

          const { left, width } = target.dataset;
          const preLeft = parseFloat(left || "0");
          const preWidth = parseFloat(width || "0");
          deltaX.current += delta;
          resize({ preLeft, preWidth, dir });
        });
        if (!result) return;
      }

      const { left, width } = target.dataset;
      const preLeft = parseFloat(left || "0");
      const preWidth = parseFloat(width || "0");

      deltaX.current += (dir === "left" ? e.deltaRect?.left : e.deltaRect?.right) || 0;
      resize({ preLeft, preWidth, dir });
    };

    const handleResizeStop = (e: ResizeEvent) => {
      deltaX.current = 0;
      isAdsorption.current = false;
      stopAutoScroll();

      const target = e.target;

      const { left, width } = target.dataset;
      const preLeft = parseFloat(left || "0");
      const preWidth = parseFloat(width || "0");
      const dir: Direction = e.edges?.right ? "right" : "left";
      onResizeEnd &&
        onResizeEnd(dir, {
          left: preLeft,
          width: preWidth
        });
    };

    useEffect(() => {
      return () => {
        interactableRef.current?.unset();
        interactableRef.current = undefined;
      };
    }, []);

    useEffect(() => {
      if (!nodeRef.current) return;
      interactableRef.current = interact(nodeRef.current);
      const interactable = interactableRef.current;

      if (enableDragging)
        interactable.draggable({
          autoScroll: true,
          inertia: true,
          lockAxis: "x",
          onmove: handleMove,
          onstart: handleMoveStart,
          onend: handleMoveStop,
          cursorChecker: () => ""
        });

      if (enableResizing)
        interactable.resizable({
          edges: {
            left: true,
            right: true,
            top: false,
            bottom: false,
            ...(edges || {})
          },
          onmove: handleResize,
          onstart: handleResizeStart,
          onend: handleResizeStop
        });
    }, []);

    return cloneElement(children as ReactElement, {
      ref: nodeRef,
      draggable: false,
      style: {
        ...((children as ReactElement).props.style || {}),
        left,
        width
      }
    });
  }
);

RowDnd.displayName = "RowDnd";
