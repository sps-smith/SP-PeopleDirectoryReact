import { AadHttpClient, AadHttpClientFactory } from '@microsoft/sp-http';
import { FilterSelectedObjects } from '../components/IReactPeopleDirectoryProps';

export interface IApiFilter {
    filterName: string;
    value: string;
}

export interface IApiPeopleRecord {
    employeeName: string;
    jobTitle: string;
    email: string;
    telephone: string;
    country: string;
    office: string;
    city: string;
    company: string;
    vbu: string;
    employeeUserId: number;
    userPrincipalId: string;
    attribute9: string;
    costCenter: string;
}

// export const DEFAULT_API_BASE_URL = 'https://volarispeopledirectorywebapi.azurewebsites.net';
export const DEFAULT_API_BASE_URL = 'https://volarispeopledirectorywebapi.azurewebsites.net';
export const DEFAULT_API_RESOURCE = DEFAULT_API_BASE_URL;

export default class PeopleDirectoryClient {
    private readonly _baseUrl: string;
    private readonly _apiResource: string;
    private readonly _clientFactory: AadHttpClientFactory;

    public constructor(clientFactory: AadHttpClientFactory, baseUrl: string, apiResource: string) {
        this._clientFactory = clientFactory;
        this._baseUrl = baseUrl.replace(/\/$/, '');
        this._apiResource = apiResource.replace(/\/$/, '');
    }

    public async getFilters(): Promise<IApiFilter[]> {
        return this.request<IApiFilter[]>('/GetFilters');
    }

    public async getDefaultPeople(country: string, vbu: string): Promise<IApiPeopleRecord[]> {
        const path = country === '' && vbu === ''
            ? '/api/getpeople'
            : `/api/webpartfilter?${this.query({ Country: country, VBU: vbu })}`;
        return this.request<IApiPeopleRecord[]>(path);
    }

    public async searchPeople(searchText: string, country: string, vbu: string): Promise<IApiPeopleRecord[]> {
        const path = country === '' && vbu === ''
            ? `/GetSearchRecords?${this.query({ SearchText: searchText })}`
            : `/api/webpartfilter/GetSearchRecords?${this.query({ SearchText: searchText, Country: country, VBU: vbu })}`;
        return this.request<IApiPeopleRecord[]>(path);
    }

    public async filterPeople(filters: FilterSelectedObjects[], country: string, vbu: string): Promise<IApiPeopleRecord[]> {
        const path = country === '' && vbu === ''
            ? '/GetFilterRecords'
            : `/api/webpartfilter/GetFilterRecords?${this.query({ Country: country, VBU: vbu })}`;
        return this.request<IApiPeopleRecord[]>(path, 'POST', filters);
    }

    public async filterAndSearchPeople(filters: FilterSelectedObjects[], searchText: string, country: string, vbu: string): Promise<IApiPeopleRecord[]> {
        const path = country === '' && vbu === ''
            ? `/GetFilterSearchRecords?${this.query({ SearchText: searchText })}`
            : `/api/webpartfilter/GetFilterSearchRecords?${this.query({ SearchText: searchText, Country: country, VBU: vbu })}`;
        return this.request<IApiPeopleRecord[]>(path, 'POST', filters);
    }

    public async getLiveStatus(name: string): Promise<boolean> {
        return this.request<boolean>(`/getvolaris101live?${this.query({ UserValue: name })}`);
    }

    private query(values: { [key: string]: string }): string {
        const params = new URLSearchParams();
        Object.keys(values).forEach(key => {
            if (values[key] !== '') {
                params.set(key, values[key]);
            }
        });
        return params.toString();
    }

    private async request<T>(path: string, method: 'GET' | 'POST' = 'GET', body?: unknown): Promise<T> {
        const client: AadHttpClient = await this._clientFactory.getClient(this._apiResource);
        const options: any = {
            headers: new Headers({ Accept: 'application/json' })
        };

        if (method === 'POST') {
            options.headers.set('Content-Type', 'application/json');
            options.body = JSON.stringify(body || []);
        }

        const response = method === 'POST'
            ? await client.post(`${this._baseUrl}${path}`, AadHttpClient.configurations.v1, options)
            : await client.get(`${this._baseUrl}${path}`, AadHttpClient.configurations.v1);

        if (!response.ok) {
            const details = await response.text();
            console.log(details);
            throw new Error(`People Directory API request failed (${response.status}): ${details}`);
        }

        return response.json();
    }
}
