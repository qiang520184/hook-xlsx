import React, { useState, useEffect } from 'react';
import { Upload, message, Button, Icon } from 'antd';

function UploadFile() {
	return (
		<div>
			<Upload>
				<Button>
					<Icon type="upload" /> Click to Upload
				</Button>
			</Upload>
		</div>
	);
}
export default UploadFile;
