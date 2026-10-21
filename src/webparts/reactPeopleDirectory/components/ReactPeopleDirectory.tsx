import * as React from 'react';
import styles from './ReactPeopleDirectory.module.scss';
import { IReactPeopleDirectoryProps } from './IReactPeopleDirectoryProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import SearchBox from './SearchBox/searchbox';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';



export default class ReactPeopleDirectory extends React.Component<IReactPeopleDirectoryProps, {}> {
	public render(): React.ReactElement<IReactPeopleDirectoryProps> {
		const {
		hasTeamsContext,
		userDisplayName,
		countryName,
		VBUName,
		Url,
		peopleDirectoryClient
		} = this.props;

		return (
		<FluentProvider theme={teamsLightTheme}>
			<section className={`${styles.reactPeopleDirectory} ${hasTeamsContext ? styles.teams : ''}`}>
				<SearchBox CountryValue={countryName} VBUValue={VBUName} userEmail={userDisplayName} Url={Url} peopleDirectoryClient={peopleDirectoryClient}/>
			</section>
		</FluentProvider>
		);
	}
}
