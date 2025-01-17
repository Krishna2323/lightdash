import {
    CreateDashboard,
    CreateSavedChart,
    Dashboard,
    DashboardChartTile,
    DashboardTileTypes,
    SavedChart,
    SEED_PROJECT,
    UpdateDashboard,
} from '@lightdash/common';
import { ChartType } from '@lightdash/common/src/types/savedCharts';

const apiUrl = '/api/v1';

const chartMock: CreateSavedChart = {
    name: 'chart in dashboard',
    tableName: 'orders',
    metricQuery: {
        dimensions: ['orders_customer_id'],
        metrics: [],
        filters: {},
        sorts: [],
        limit: 1,
        tableCalculations: [],
    },
    chartConfig: {
        type: ChartType.TABLE,
    },
    tableConfig: {
        columnOrder: [],
    },
};

const dashboardMock: CreateDashboard = {
    name: 'Create dashboard via API',
    tiles: [
        {
            type: DashboardTileTypes.SAVED_CHART,
            x: 0,
            y: 0,
            h: 5,
            w: 5,
            properties: {
                savedChartUuid: null,
                newChartData: chartMock,
            },
        },
    ],
};

describe('Lightdash dashboard', () => {
    before(() => {
        cy.login();
        // clean previous e2e dashboards and charts
        cy.deleteDashboardsByName([dashboardMock.name]);
        cy.deleteChartsByName([chartMock.name]);
    });
    beforeEach(() => {
        cy.login();
    });
    it('Should create dashboard and chart at the same time', () => {
        const projectUuid = SEED_PROJECT.project_uuid;

        // create dashboard and chart
        cy.request<{ results: Dashboard }>({
            method: 'POST',
            url: `${apiUrl}/projects/${projectUuid}/dashboards`,
            body: dashboardMock,
        }).then((createDashboardResponse) => {
            const tile = createDashboardResponse.body.results.tiles[0];

            expect(tile.properties).to.have.property('savedChartUuid');
            // confirm chart was created
            cy.request<{ results: SavedChart }>(
                `${apiUrl}/saved/${
                    (tile as DashboardChartTile).properties.savedChartUuid
                }`,
            ).then((chartResponse) => {
                expect(chartResponse.status).to.eq(200);
                expect(chartResponse.body.results.name).to.eq(chartMock.name);
            });

            const updateDashboardMock: UpdateDashboard = {
                tiles: [
                    ...createDashboardResponse.body.results.tiles,
                    {
                        type: DashboardTileTypes.SAVED_CHART,
                        x: 5,
                        y: 0,
                        h: 5,
                        w: 5,
                        properties: {
                            savedChartUuid: null,
                            newChartData: chartMock,
                        },
                    },
                ],
            };
            // update dashboard and create new chart
            cy.request<{ results: Dashboard }>({
                method: 'PATCH',
                url: `${apiUrl}/dashboards/${createDashboardResponse.body.results.uuid}`,
                body: updateDashboardMock,
            }).then((updateDashboardResponse) => {
                const firstTile = updateDashboardResponse.body.results.tiles[0];
                const secondTile =
                    updateDashboardResponse.body.results.tiles[1];

                expect(secondTile.properties).to.have.property(
                    'savedChartUuid',
                );
                // confirm first chart didn't change
                expect(
                    (firstTile as DashboardChartTile).properties.savedChartUuid,
                ).to.eq((tile as DashboardChartTile).properties.savedChartUuid);
                // confirm second chart is different from first chart
                expect(
                    (secondTile as DashboardChartTile).properties
                        .savedChartUuid,
                ).to.not.eq(
                    (tile as DashboardChartTile).properties.savedChartUuid,
                );

                // confirm chart was created during dashboard update
                cy.request<{ results: SavedChart }>(
                    `${apiUrl}/saved/${
                        (secondTile as DashboardChartTile).properties
                            .savedChartUuid
                    }`,
                ).then((chartResponse) => {
                    expect(chartResponse.status).to.eq(200);
                    expect(chartResponse.body.results.name).to.eq(
                        chartMock.name,
                    );
                });
            });
        });
    });
});
