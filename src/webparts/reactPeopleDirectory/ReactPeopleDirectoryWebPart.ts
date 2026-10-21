import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'ReactPeopleDirectoryWebPartStrings';
import ReactPeopleDirectory from './components/ReactPeopleDirectory';
import { IReactPeopleDirectoryProps } from './components/IReactPeopleDirectoryProps';
import { Providers, SharePointProvider } from '@microsoft/mgt';
import { AadHttpClientFactory } from '@microsoft/sp-http';
import PeopleDirectoryClient, { DEFAULT_API_BASE_URL, DEFAULT_API_RESOURCE, IApiFilter } from './services/PeopleDirectoryClient';

export interface IReactPeopleDirectoryWebPartProps {
  description: string;
  countryselect: string;
  vbuselect: string;
  apiBaseUrl: string;
  apiResource: string;
}

export default class ReactPeopleDirectoryWebPart extends BaseClientSideWebPart<IReactPeopleDirectoryWebPartProps> {

	private _isDarkTheme: boolean = false;
	private _environmentMessage: string = '';
	

	private _countryvalues: IPropertyPaneDropdownOption[] = [{key: '', text: "No Country Selected"}];
	private _vbuvalues: IPropertyPaneDropdownOption[] = [{key: '', text: "No VBU Selected"}];
	private _apiClient: PeopleDirectoryClient;

	public render(): void {
		const element: React.ReactElement<IReactPeopleDirectoryProps> = React.createElement(
		ReactPeopleDirectory,
		{
			description: this.properties.description,
			isDarkTheme: this._isDarkTheme,
			environmentMessage: this._environmentMessage,
			hasTeamsContext: !!this.context.sdks.microsoftTeams,
			userDisplayName: this.context.pageContext.user.email,
			countryName: this.properties.countryselect,
			VBUName: this.properties.vbuselect,
			Url: this.context.pageContext.site.absoluteUrl,
			peopleDirectoryClient: this._apiClient
		});

		ReactDom.render(element, this.domElement);
	}

	protected onInit(): Promise<void> {
		Providers.globalProvider = new SharePointProvider(this.context);
		this._apiClient = this.createApiClient();
		this.getParms();

		return this._getEnvironmentMessage().then(message => {
			this._environmentMessage = message;
		});
	}



	private _getEnvironmentMessage(): Promise<string> {
		if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
		return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
			.then(context => {
			let environmentMessage: string = '';
			switch (context.app.host.name) {
				case 'Office': // running in Office
				environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
				break;
				case 'Outlook': // running in Outlook
				environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
				break;
				case 'Teams': // running in Teams
				environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
				break;
				default:
				throw new Error('Unknown host');
			}

			return environmentMessage;
			});
		}

		return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
	}

	private getParms(): Promise<void> {
		return this._apiClient.getFilters()
			.then((filters: IApiFilter[]) => {
				const dt = filters.filter(rec => rec.filterName === "CountryValue");
				dt.forEach(itm => {
					if (itm.value !== "")
						this._countryvalues.push({key: itm.value, text: itm.value});
				});
				const dt2 = filters.filter(rec => rec.filterName === "VBUValue");
				dt2.forEach(itm => {
					if (itm.value !== "")
						this._vbuvalues.push({key: itm.value, text: itm.value});
				});
			}).catch(error => console.error('Unable to load people directory filters', error));
	}

	private createApiClient(): PeopleDirectoryClient {
		const clientFactory: AadHttpClientFactory = this.context.aadHttpClientFactory;
		return new PeopleDirectoryClient(
			clientFactory,
			this.properties.apiBaseUrl || DEFAULT_API_BASE_URL,
			this.properties.apiResource || DEFAULT_API_RESOURCE
		);
	}

	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
		if (!currentTheme) {
			return;
		}

		this._isDarkTheme = !!currentTheme.isInverted;
		const {
			semanticColors
		} = currentTheme;

		if (semanticColors) {
			this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
			this.domElement.style.setProperty('--link', semanticColors.link || null);
			this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
		}

	}

	protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
		super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
		if (propertyPath === 'apiBaseUrl' || propertyPath === 'apiResource') {
			this._apiClient = this.createApiClient();
			this.render();
		}
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
		pages: [
			{
			header: {
				description: strings.PropertyPaneDescription
			},
			groups: [
				{
				groupName: strings.BasicGroupName,
				groupFields: [
					PropertyPaneTextField('description', {
					label: strings.DescriptionFieldLabel
					}),
					PropertyPaneDropdown('countryselect',{
						label: 'Select a Country',
						options: this._countryvalues,
						selectedKey: this.properties.countryselect
					}),
					PropertyPaneDropdown('vbuselect',{
						label: 'Select a VBU',
						options: this._vbuvalues,
						selectedKey: this.properties.vbuselect
					}),
					PropertyPaneTextField('apiBaseUrl', {
						label: 'People Directory API base URL'
					}),
					PropertyPaneTextField('apiResource', {
						label: 'People Directory API resource URI'
					})
				]
				}
			]
			}
		]
		};
	}

	// protected get disableReactivePropertyChanges(): boolean{
	// 	return true;
	// }
}
