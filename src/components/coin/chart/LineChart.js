import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

import { useCurrency } from '../../../currency/CurrencyContext.js';
import NumberFormatter from '../../../helpers/NumberFormatter.js';

function getTicks (days) {
    const isSmallScreen = window.innerWidth <= 768;

    switch (days) {
        case 1:
            return isSmallScreen ? 4 : 8;
        case 7:
            return isSmallScreen ? 4 : 7;
        default:
            return isSmallScreen ? 4 : 13;
    }
}

function CustomTooltip ({ active, payload, days }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-3 rounded-2 shadow color_input">
                <p className='mb-2'>{days === 1 ? '🕛 Time' : '📅 Date'}: {data.Time}</p>
                <p>{`💵 Price: ${data.Formated_price}`}</p>
            </div>
        );
    }
    return null;
}


function LineChart({ chart, days }) {
    const { currency } = useCurrency();
    const formatter = new NumberFormatter(currency);

    function mapChartData(time, priceAtTime, days) {
        let priceFormat = formatter.format(
            priceAtTime, 
            formatter.priceOptions()
        );

        if (priceAtTime < 1) {
            priceFormat = formatter.format(
                priceAtTime, 
                formatter.smallPriceOptions()
            );
        }

        const date = new Date(time);
        const hours = `${date.getHours() % 12 || 12} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;

        if (days === 1) {
            return {
                Time: hours,
                Price: priceAtTime,
                Formated_price: priceFormat,
            };
        }
        else if (days === 365) {
            return {
                Time: date.toLocaleString('default', { month: 'short' }),
                Price: priceAtTime,
                Formated_price: priceFormat,
            };
        }
        else {
            return {
                Time: `${date.getMonth() + 1}/${date.getDate()}`,
                Price: priceAtTime,
                Formated_price: priceFormat,
            };
        }   
    }

    const chartData = chart.map(([time, priceAtTime]) => mapChartData(time, priceAtTime));

    const minPrice = Math.min(...chart.map((data) => data.Price));
    const maxPrice = Math.max(...chart.map((data) => data.Price));
    const yDomain = [Math.floor(minPrice), Math.ceil(maxPrice)];

    const numberOfTicks = getTicks(days)
    const tickInterval = Math.ceil(chartData.length / numberOfTicks);

    const formatYAxisLabel = (price) => formatter.format(price, formatter.bigNumberOptions());

    return (
        <div style={{ width: '100%', height: 380 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 50,
                        right: 0,
                        left: 20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid stroke="#ffffff12" />
                    <XAxis dataKey="Time" interval={tickInterval} />
                    <YAxis domain={yDomain} tickFormatter={formatYAxisLabel} orientation="right" />
                    <Tooltip content={<CustomTooltip days = {days} />} />
                    <Area type="monotone" dataKey="Price" stroke="var(--color-accent)" fill="var(--color-chart)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineChart;