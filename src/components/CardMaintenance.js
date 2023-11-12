import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGauge } from "@fortawesome/free-solid-svg-icons";
import { helper } from "../context/helper";

library.add([faGauge]);

const CardMaintenance = (props) => {
    const {maintenance}  = props
    const { dateFormat,timeFormat,moneyFormat,numberFormat } = helper();
    
    return (
        <>
            <div className="card mb-3">
                <div className="card-header bg-primary bg-gradient text-white">
                    {dateFormat(maintenance.created_at)} {timeFormat(maintenance.created_at)}
                </div>
                <div className="card-body">
                    <div className='mb-3'>
                        <FontAwesomeIcon icon={faGauge} fixedWidth className='me-2 text-primary'/>
                        {numberFormat(maintenance.odometer)} KM
                    </div>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Nama Part</th>
                                <th>Harga Part</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                maintenance.detail_maintenance.map((detail) => {
                                    return (
                                        <tr key={'md_'+detail.id}>
                                            <td>{detail.part_name}</td>
                                            <td>{moneyFormat(detail.part_price)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
 
export default CardMaintenance;