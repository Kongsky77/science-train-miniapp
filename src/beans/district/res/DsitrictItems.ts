import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject
export default class DsitrictItems {
	@JsonProperty('id', String, true)
	id: string = '';

	// @JsonProperty('id', String, true)
	// district: string = '';

	@JsonProperty('name', String, true)
	name: string = '';
}
