import { Service } from "typedi";

@Service()
class MentionFormatService {

    private static readonly _channelMatch = new RegExp("^<#(\\d+)>$");
    private static readonly _memberMatch = new RegExp("^<@!?(\\d+)>$");
    private static readonly _roleMatch = new RegExp("^<@&(\\d+)>$");

    private extract = (mention: string|null|undefined, matcher: RegExp) : string | undefined => {
        if (mention === undefined || mention === null) return;
        const matches = mention.match(matcher);
        if (matches === null) return;
        return matches[1];
    }

    public extractChannel = (mention: string|null|undefined) : string | undefined => {
        return this.extract(mention, MentionFormatService._channelMatch);
    }

    public extractMember = (mention: string|null|undefined) : string | undefined => {
        return this.extract(mention, MentionFormatService._memberMatch);
    }

    public extractRole = (mention: string|null|undefined) : string | undefined => {
        return this.extract(mention, MentionFormatService._roleMatch);
    }

    public formatChannel = (channelId: string|null|undefined) : string|undefined => {
        if (channelId === undefined || channelId === null) return;
        return '<#' + channelId + '>';
    }

    public formatMember = (memberId: string|null|undefined) : string|undefined => {
        if (memberId === undefined || memberId === null) return;
        return '<@' + memberId + '>';
    }

    public formatRole = (roleId: string|null|undefined) : string|undefined => {
        if (roleId === undefined || roleId === null) return;
        return '<@&' + roleId + '>';
    }
}

export default MentionFormatService;