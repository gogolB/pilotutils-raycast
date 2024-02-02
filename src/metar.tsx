import { Form, LaunchProps } from "@raycast/api";
import { List } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch"

interface State {
    icao?: string;
    response?: Array<METAR_DATA>;
    error?: Error;
    
}

type METAR_DATA = {
    metar_id: number,
    icaoId: string,
    receiptTime: string,
    obsTime: number,
    reportTime: string,
    temp: number,
    dewp: number,
    wdir: number,
    wspd: number,
    wgst: number,
    visib: number,
    altim: number,
    slp: any,
    qcField: number,
    wxString: string,
    presTend: any,
    maxT: any,
    minT: any,
    maxT24: any,
    minT24: any,
    precip: any,
    pcp3hr: any,
    pcp6hr: any,
    pcp24hr: any,
    snow: any,
    vertVis: any,
    metarType: string,
    rawOb: string,
    mostRecent: string,
    lat: number,
    lon: number,
    elev: number,
    prior: number,
    name: string,
    clouds: [ [any] ]
  }


async function fetchMetar(icao: string): Promise<Array<METAR_DATA>>{
    const response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`);
    const data = await response.json() as Array<METAR_DATA>;
    return data;
}


export default function METAR(props: LaunchProps<{ arguments: Arguments.Metar }>) {
    const [state, setState] = useState<State>({});

    const icao = props.arguments.icao;
    console.log(`icao: ${icao}`)

    const req = `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`


    useEffect(() => {
        async function getMetar() {
        try {
            const resp = fetchMetar(icao);
            setState({ icao: icao, response: await resp});
        } catch (error) {
            setState({
            error: error instanceof Error ? error : new Error("Something went wrong"),
            });
        }
        }

        getMetar();
    }, []);

    console.log(state.response?.at(0)?.rawOb);
    

    return (
        <List isLoading={!state.response && !state.error} isShowingDetail> 
            {state.response?.map((metar) => (
                <List.Item
                    key={metar.metar_id}
                    title={metar.name}
                    subtitle={metar.rawOb}
                    detail={
                        <List.Item.Detail
                            metadata={
                                <List.Item.Detail.Metadata>
                                    <List.Item.Detail.Metadata.Label title="ICAO" text={metar.icaoId}/>
                                    <List.Item.Detail.Metadata.Label title="Name" text={metar.name}/>
                                    <List.Item.Detail.Metadata.Label title="Latitude" text={metar.lat.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Longitude" text={metar.lon.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Elevation" text={metar.elev.toString()}/>
                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Raw Observation" />
                                    <List.Item.Detail.Metadata.Label title={metar.rawOb.toString()} />
                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Observation Time" text={metar.obsTime.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Report Time" text={metar.reportTime.toString()}/>
                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Temperature" text={metar.temp.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Dewpoint" text={metar.dewp.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Wind Direction" text={metar.wdir.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Wind Speed" text={metar.wspd.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Visibility" text={metar.visib.toString()}/>
                                    <List.Item.Detail.Metadata.Label title="Altimeter" text={metar.altim.toString()}/>
                                </List.Item.Detail.Metadata>
                            }
                        />
                    }
                />
            ))}
        </List>
    );
}