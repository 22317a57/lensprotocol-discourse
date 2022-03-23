import { useState, useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { Box, FormControl, Textarea, Button, Spacer, useColorModeValue, Flex, Text } from '@chakra-ui/react';

import { createComment } from '../../api/publications/comment';
import { getProfiles } from '../../api/profile/get-profiles';

export default function CreateComment({ postId }) {
  const { library, account } = useEthers();
  const [comment, setComment] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const loadProfile = async () => {
      const profiles = await getProfiles(account);
      setProfile(profiles.profiles.items[0]);
    };
    loadProfile();
  }, [account]);

  const onComment = async e => {
    e.preventDefault();
    // Set Metadata according to our frontend comment policy.#
    // Name: "Comment by {handle}"
    // Description: "Comment by {handle} on proposal {postId}"
    // Content: The actual content of the comment

    // First, we need to fetch the currently logged in user's profile.
    // TODO: Pick logged-in user from a UI dropdown.
    const commentMetaData = {
      profileId: profile.id,
      publicationId: postId,
      name: `Comment by @${profile.handle}`,
      description: `This is a comment by @${profile.handle} on proposal #${postId}`,
      content: comment,
    };
    console.log('COMMENT METADATA: ', commentMetaData);

    //  postMetaData: {
    //    profileId: hexId: the ID of who is pubilishing the post (must be logged-in).
    //    publicationId: hexId-hexId: The ID of the publication to point comment on.
    //    description?: Markdown
    //    content?: Markdown
    //    external_url: Url
    //    image: Url
    //    imageMimeType: MimeType (e.g. 'image/jpeg')
    //    name: string
    //    media: [ {
    //          item: Url
    //          type: MimeType (e.g. 'image/jpeg')
    //        } ]
    //    appId: 'testing-daoscourse'
    //  }

    const res = await createComment(library.getSigner(), commentMetaData);
    console.log(res);
  };

  const border = useColorModeValue('gray.300', 'gray.700');

  return (
    <Box w='full' mt={3} p={3} border='1px solid' borderColor={border}>
      <form onSubmit={onComment} style={{ textAlign: 'right' }}>
        <FormControl isRequired borderBottom='1px solid' borderColor={border}>
          <Textarea
            placeholder='Write your comment here'
            border='0'
            resize='none'
            onChange={e => setComment(e.target.value)}
          />
        </FormControl>
        <Flex>
          <Text fontSize={16} width='fit-content' my='auto'>
            {profile?.name} :
          </Text>
          <Spacer />
          <Button type='submit' mt={3}>
            Publish Comment
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
