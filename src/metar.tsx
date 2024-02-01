import { Form, LaunchProps } from "@raycast/api";
import { List } from "@raycast/api";
import { useEffect, useState } from "react";
import fetch from "node-fetch"

interface State {
    icao?: string;
    response?: unknown;
    error?: Error;
    
}


export default function Todoist(props: LaunchProps<{ arguments: Arguments.Metar }>) {
    const [state, setState] = useState<State>({});

    const icao = props.arguments.icao;
    console.log(`icao: ${icao}`)

    const req = `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`


    useEffect(() => {
        async function getMetar() {
        try {
            const resp = await fetch(req);
            setState({ icao: icao, response: await resp.json() });
        } catch (error) {
            setState({
            error: error instanceof Error ? error : new Error("Something went wrong"),
            });
        }
        }

        getMetar();
    }, []);

    console.log(state.response); // Prints stories

    return <List isLoading={!state.response && !state.error} />;
}