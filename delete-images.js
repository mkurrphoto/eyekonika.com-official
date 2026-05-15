#!/usr/bin/env node

/**
 * CLI script to delete image files from GitHub repository
 * 
 * Usage: node delete-images.js <github-token> [branch]
 * 
 * Example: node delete-images.js ghp_xxxxxxxxxxxx main
 */

const https = require('https');

const OWNER = 'mkurrphoto';
const REPO = 'eyekonika.com-official';
const BRANCH = process.argv[3] || 'main';
const TOKEN = process.argv[2];

const FILES_TO_DELETE = [
  'pexels-alejandro-de-roa-649065356-34049972.jpg',
  'pexels-apasaric-325185.jpg',
  'pexels-johnny-34073266.jpg',
  'pexels-man-fong-wong-278505948-34087658.jpg',
  'pexels-michael-schlierf-757699958-18717806.jpg',
  'pexels-olegprachuk-7987349.jpg',
  'pexels-platon-matakaev-162269967-11422451.jpg',
  'pexels-rudy-kirchner-278171-2759804.jpg',
  'pexels-skydream-14187938.jpg',
  'pexels-skyriusmarketing-2129796.jpg',
  'pexels-tracehudson-2724664.jpg',
  'pexels-willianjusten-24604776.jpg',
  'pexels-yulia-pribytkova-76505330-8924381.jpg',
];

const BASE_PATH = 'images/photo-backgrounds';

if (!TOKEN) {
  console.error('Error: GitHub token is required');
  console.error('Usage: node delete-images.js <github-token> [branch]');
  console.error('\nGet a token from: https://github.com/settings/tokens');
  console.error('Token needs: repo (full control of private repositories)');
  process.exit(1);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'delete-images-script',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function getFileSha(filename) {
  const path = `${BASE_PATH}/${filename}`;
  const apiPath = `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;

  try {
    const response = await makeRequest('GET', apiPath);
    if (response.status === 200) {
      return response.data.sha;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching SHA for ${filename}:`, error.message);
    return null;
  }
}

async function deleteFile(filename) {
  const sha = await getFileSha(filename);

  if (!sha) {
    console.log(`⚠️  Skipped: ${filename} (not found)`);
    return false;
  }

  const path = `${BASE_PATH}/${filename}`;
  const apiPath = `/repos/${OWNER}/${REPO}/contents/${path}`;

  try {
    const response = await makeRequest('DELETE', apiPath, {
      message: `Delete ${filename}`,
      sha: sha,
      branch: BRANCH,
    });

    if (response.status === 200) {
      console.log(`✅ Deleted: ${filename}`);
      return true;
    } else {
      console.log(`❌ Failed: ${filename} (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log(`🚀 Starting deletion of ${FILES_TO_DELETE.length} files`);
  console.log(`📍 Repository: ${OWNER}/${REPO}`);
  console.log(`🌿 Branch: ${BRANCH}`);
  console.log(`📁 Directory: ${BASE_PATH}\n`);

  let successful = 0;
  let failed = 0;

  for (const file of FILES_TO_DELETE) {
    const deleted = await deleteFile(file);
    if (deleted) {
      successful++;
    } else {
      failed++;
    }
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully deleted: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${successful + failed}`);

  if (failed === 0) {
    console.log('\n🎉 All files deleted successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some files failed to delete.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
