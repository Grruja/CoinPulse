import Error from '../../Error';
import Loading from '../../Loading';
import ColorChange from '../../../helpers/ColorChange';

function MarketData({ marketData, status }) {
    const textColor = new ColorChange();

    return (
        <article className='color_bg_tr w-100 rounded-2 px-4 py-3'>
            <h5 className='border-bottom pb-3'>📊 Today's Market</h5>

            {status.loading && <Loading />}

            {status.error && <Error error = {status.error}/>}

            {!status.loading && !status.error && (
                <ul className='list-unstyled'>
                    <li className='mt-4 py-1 d-flex justify-content-between align-items-center'>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-coins me-3" style={{fontSize: '1.05rem'}}></i>
                            <p>Market cap change</p>
                        </div>
                        <p className={textColor.colorChange(marketData.mcap_change)}>
                            {marketData.mcap_change}%
                        </p>
                    </li>

                    <li className='mt-4 py-1 d-flex justify-content-between align-items-center'>
                        <div className='d-flex align-items-center'>
                            <i className="fa-solid fa-chart-simple me-3" style={{fontSize: '1.05rem'}}></i>
                            <p>Volume change</p>
                        </div>
                        <p className={textColor.colorChange(marketData.volume_change)}>
                            {marketData.volume_change}%
                        </p>
                    </li>

                    <li className='mt-4 py-1 d-flex justify-content-between align-items-center'>
                        <div className='d-flex align-items-center'>
                            <i className="fa-brands fa-bitcoin me-3" style={{fontSize: '1.05rem'}}></i>
                            <p>Bitcoin dominance</p>
                        </div>
                        <p>{marketData.btc_d}%</p>
                    </li>
                </ul>
            )}
        </article>
    )
}

export default MarketData;