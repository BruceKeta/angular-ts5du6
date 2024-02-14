import { Component } from '@angular/core';
import { SeriesDefaults, SeriesVisualArgs } from '@progress/kendo-angular-charts';
import { drawing, geometry, GradientStop, LinearGradient, Path, Arc as ArcDrawing, Group } from '@progress/kendo-drawing';
import { Arc, Point, Rect  } from '@progress/kendo-drawing/geometry';
import {
    AxisLabelClickEvent,
    LegendItemClickEvent,
    LegendItemHoverEvent,
    PlotAreaClickEvent,
    PlotAreaHoverEvent,
    SeriesClickEvent,
    SeriesHoverEvent,
  } from "@progress/kendo-angular-charts";
const { transform } = geometry;

@Component({
    selector: 'my-app',
    template: `
        <kendo-chart [seriesDefaults]="seriesDefaults" (plotAreaHover)="myClick($event)">
            <kendo-chart-title text="Site Visitors Stats /thousands/"></kendo-chart-title>
            <kendo-chart-legend position="bottom" orientation="horizontal"> </kendo-chart-legend>
            <kendo-chart-category-axis>
                <kendo-chart-category-axis-item [categories]="categories"> </kendo-chart-category-axis-item>
            </kendo-chart-category-axis>
            <kendo-chart-series>
                <kendo-chart-series-item
                    name="Total Visits"
                    [data]="[56000, 63000, 74000, 91000, 117000, 138000, 128000, 115000, 102000, 98000, 123000, 113000]"
                >
                </kendo-chart-series-item>
                <kendo-chart-series-item
                    name="Unique visitors"
                    [data]="[52000, 34000, 23000, 48000, 67000, 83000, 40000, 50000, 64000, 72000, 75000, 81000]"
                >
                </kendo-chart-series-item>
            </kendo-chart-series>
        </kendo-chart>
    `
})
export class AppComponent {

    public  myGroup : Group; 
    public originBB : Rect;

    public categories: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public seriesDefaults: SeriesDefaults = {
        type: 'column',
        stack: true,
        tooltip: { visible: true },
        highlight: {
            toggle: (e) => {
                // Don't create a highlight overlay,
                // we'll modify the existing visual instead
                e.preventDefault();

                var visual = e.visual;
                var opacity = e.show ? 0.8 : 1;

                visual.opacity(opacity);
            }
        },
        visual: (e: SeriesVisualArgs) => {
            return this.createColumn(e.rect, e.options.color);
        }
    };
public myClick(e: PlotAreaHoverEvent)
{
    
    this.myGroup.transform(transform().translate(    e.originalEvent.clientX -this.originBB.origin.x  ,  e.originalEvent.clientY - this.originBB.origin.y ));
}
    private createColumn(rect: Rect, color: string): Group {
        const origin: Point = rect.origin;
        const center = rect.center();
        const bottomRight = rect.bottomRight();
        const radiusX = rect.width() / 2;
        const radiusY = radiusX / 3;
        const gradient: LinearGradient = new drawing.LinearGradient({
            stops: [
                new GradientStop(0, color),
                new GradientStop(0.5, color, 0.9),
                new GradientStop(0.5, color, 0.9),
                new GradientStop(1, color)
            ]
        });

        const path: Path = new drawing.Path({
            fill: gradient,
            stroke: {
                color: 'none'
            }
        })
            .moveTo(origin.x, origin.y)
            .lineTo(origin.x, bottomRight.y)
            .arc(180, 0, radiusX, radiusY, true)
            .lineTo(bottomRight.x, origin.y)
            .arc(0, 180, radiusX, radiusY);

        const topArcGeometry: Arc = new geometry.Arc([center.x, origin.y], {
            startAngle: 0,
            endAngle: 360,
            center: null,
            radiusX: radiusX,
            radiusY: radiusY
        });

        const topArc: ArcDrawing = new drawing.Arc(topArcGeometry, {
            fill: {
                color: color
            },
            stroke: {
                color: '#ebebeb'
            }
        });
        const group: Group = new drawing.Group();
        group.append(path, topArc);

        this.myGroup = group ;
        this.originBB = group.bbox();

        return group;
    }
}
